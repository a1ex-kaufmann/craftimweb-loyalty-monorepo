import connexion
from flask import current_app
from sqlalchemy import exc

from config import ContractConfig, FlaskConfig, ConfigCJrc1Contract
from src.evotor.models import Organisation, EvotorUser
from src.evotor.workers import create_loyalty
from src.extentions import queue
from src.log import get_logger
from src.utils import hash_new_password, is_correct_password, encode_token

logger = get_logger("evotor")


def callback_shops(storeUuid):
    logger.info(f"callback_shops, path: {storeUuid=}, input parameters body: {connexion.request.json}")

    # subscription_id = connexion.request.json.get("items")
    response = {}
    logger.info(f"Response: {response}")
    return response, 200


def callback_subscription():
    logger.info(f"callback_subscription, input parameters body: {connexion.request.json}")

    subscription_id = connexion.request.json.get("subscriptionId")
    product_id = connexion.request.json.get("productId")
    user_id = connexion.request.json.get("userId")
    timestamp = connexion.request.json.get("timestamp")
    sequence_number = connexion.request.json.get("sequenceNumber")
    type_ = connexion.request.json.get("type")
    plan_id = connexion.request.json.get("planId")
    trial_period_duration = connexion.request.json.get("trialPeriodDuration")
    device_number = connexion.request.json.get("deviceNumber")

    try:
        user = current_app.session.query(EvotorUser).filter_by(evotor_user_id=user_id).one()
        organisation = current_app.session.query(Organisation).filter_by(id=user.organisation).one()
        organisation.evotor_status = type_
        organisation.amount_devices = device_number
        organisation.trial_period_duration = trial_period_duration
        current_app.session.add(organisation)
        current_app.session.commit()
        current_app.session.remove()

        response = {}
        logger.info(f"Response: {response}")
        return response, 200

    except exc.NoResultFound as e:
        response = {"errors": [{"message": "User not found"}]}
        logger.info(f"Response: {response}")
        current_app.session.remove()
        return response, 404


def callback_token():
    logger.info(f"callback_token, input parameters body: {connexion.request.json}")

    user_id = connexion.request.json.get("userId")
    evotor_token = connexion.request.json.get("token")

    evotor_user = current_app.session.query(EvotorUser).filter_by(evotor_user_id=user_id).one_or_none()

    if evotor_user:
        evotor_user.evotor_token = evotor_token
        current_app.session.add(evotor_user)
        current_app.session.commit()
        logger.info("Evotor token was updated")

        current_app.session.remove()

        response = {}
        logger.info(f"Response: {response}")
        return response, 200
    else:
        response = {"errors": [{"message": "User not found"}]}
        logger.info(f"Response: {response}")
        current_app.session.remove()
        return response, 404


def callback_verify_user():
    logger.info(f"callback_verify_user")

    user_id = connexion.request.json.get("userId")
    email = connexion.request.json.get("username").strip()
    password = connexion.request.json.get("password").strip()
    logger.info(f"Input parameters body: {email=}, password={'*' * len(password)}")

    try:
        user = current_app.session.query(EvotorUser).filter_by(username=email).one()

        if user and is_correct_password(user.salt, user.password, password):
            # Create JWT token
            jwt_token = encode_token(user.id, FlaskConfig.SECRET_KEY)
            logger.info(f"Token was created for user: {user.id}, token: {jwt_token}")

            response = {
                "userId": user_id,
                "token": jwt_token
            }
            logger.info(f"Response: {response}")
            current_app.session.remove()
            return response, 200
        else:
            response = {"errors": [{"code": 1006, "message": "Incorrect auth data"}]}
            logger.info(f"Response: {response}")
            current_app.session.remove()
            return response, 401
    except exc.NoResultFound as e:
        response = {"errors": [{"message": "User not found"}]}
        logger.info(f"Response: {response}")
        current_app.session.remove()
        return response, 404


def callback_create_user():
    logger.info(f"callback_create_user")

    user_id = connexion.request.json["userId"]
    email = connexion.request.json["username"].strip()
    org_name = connexion.request.json["org_name"].strip()
    password = connexion.request.json["password"].strip()
    password_confirm = connexion.request.json["password_confirm"].strip()

    logger.info(f"input parameters: {user_id=}, {email=}, {org_name=}, password={'*' * len(password)}")

    if password != password_confirm:
        return {"errors": "Password didn't match"}, 400

    # Get user, if was created then return error
    user = current_app.session.query(EvotorUser).filter_by(username=email).one_or_none()
    if user:
        current_app.session.remove()
        return {"errors": "User exist with same username"}, 409

    # Get organisation or create one
    org = current_app.session.query(Organisation).filter_by(name=org_name).one_or_none()
    if org is None:
        org = Organisation(name=org_name, wallet=ContractConfig.SENDER)
        current_app.session.add(org)
        current_app.session.commit()
        queue.enqueue(create_loyalty, org.id, job_timeout="2m")

        print(f"Organisation was created: {org}")

    # Create user and append one to organisation
    salt, stored_pass = hash_new_password(password)

    user = EvotorUser(
        username=email,
        password=stored_pass,
        evotor_user_id=user_id,
        salt=salt
    )
    org.users.append(user)

    current_app.session.add(user)
    current_app.session.add(org)
    current_app.session.commit()
    print(f"User was created: {user}")

    jwt_token = encode_token(user.id, FlaskConfig.SECRET_KEY)
    logger.info(f"Token was created for user id: {user.id}, token: {jwt_token}")
    current_app.session.remove()

    response = {
        "userId": user_id,
        "token": jwt_token
    }

    logger.info(f"Response: {response}")

    return response, 200
