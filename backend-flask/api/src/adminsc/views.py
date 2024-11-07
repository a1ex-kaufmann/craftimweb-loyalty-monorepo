import connexion
from flask import current_app

from config import FlaskConfig
from src.erc20.erc20_jrc1_client import JRC1BonusERC20
from src.evotor.models import EvotorUser, Organisation
from src.log import get_logger
from src.utils import encode_token, is_correct_password

logger = get_logger("adminsc")


def auth():
    logger.info(f"Auth")

    # Extract data
    email = connexion.request.json["email"]
    password = connexion.request.json["password"]
    logger.info(f"Input parameters body: {email=}, password={len(password) * '*'}")

    # Validation data
    user = current_app.session.query(EvotorUser).filter_by(username=email).one_or_none()
    if user:
        logger.info(f"Found user: {user}")
    else:
        return {"error": "Not found users"}, 404

    if user and is_correct_password(user.salt, user.password, password):
        # Create JWT token
        jwt_token = encode_token(user.id, FlaskConfig.SECRET_KEY)
        logger.info(f"Token was created, token: {jwt_token}")

        response = {
            "token": jwt_token
        }
        current_app.session.remove()
        logger.info(f"Response: {response}")
        return response, 200
    else:
        current_app.session.remove()
        return {}, 401


def get_subscription():
    logger.info(f"get_subcription: token info {connexion.context['token_info']}")

    user_id = connexion.context['token_info']["id"]

    user = current_app.session.query(EvotorUser).filter_by(id=user_id).one()
    org = current_app.session.query(Organisation).filter_by(id=user.organisation).one()

    status_subscription = False
    if org.evotor_status == "SubscriptionCreated" or \
            org.evotor_status == "SubscriptionActivated" or \
            org.evotor_status == "SubscriptionRenewed":
        status_subscription = True

    current_app.session.remove()

    response = {
        "isActive": status_subscription
    }
    logger.info(f"Response: {response}")
    return response, 200


def get_loyalty():
    logger.info(f"get_loyalty: token info {connexion.context['token_info']}")

    user_id = connexion.context['token_info']["id"]

    user = current_app.session.query(EvotorUser).filter_by(id=user_id).one()
    org = current_app.session.query(Organisation).filter_by(id=user.organisation).one()
    logger.info(f"Found org: {org} and user: {user}")

    if not org.loyalty_address:
        return {"error": "Loyalty address wasn't created for this organisation. Try request late"}, 425

    erc20_jrc1_bonus = JRC1BonusERC20(org.loyalty_address)
    loyalty_params = erc20_jrc1_bonus.get_loyalty_params()
    current_app.session.remove()

    accrual_percent, min_accrual_threshold = loyalty_params[0], loyalty_params[1]
    write_off_rate, max_write_off_percent = loyalty_params[2], loyalty_params[3]
    is_simultaneous = loyalty_params[4]
    logger.info(f"Loyalty params: {accrual_percent=}, {min_accrual_threshold=}, "
                f"{write_off_rate=}, {max_write_off_percent=}, {is_simultaneous=}")

    impl_name = erc20_jrc1_bonus.get_name()
    generation = erc20_jrc1_bonus.get_generation()

    response = {
        "accrualPercent": accrual_percent,
        "minAccrualThreshold": min_accrual_threshold / 10 ** 18,
        "accrualRate": write_off_rate / 10 ** 18,
        "maxWriteoffPercent": max_write_off_percent,
        "isSimultaneous": is_simultaneous,
        "name": impl_name,
        "generation": generation
    }
    logger.info(f"Response: {response}")
    return response, 200


def edit_loyalty():
    logger.info(f"auth, input parameters body: {connexion.request.json}")

    accrual_percent = int(connexion.request.json["accrualPercent"])
    min_accrual_threshold = int(connexion.request.json["minAccrualThreshold"])
    accrual_rate = int(connexion.request.json["accrualRate"])
    max_write_off_percent = int(connexion.request.json["maxWriteoffPercent"])
    is_simultaneous = bool(connexion.request.json["isSimultaneous"])

    user_id = connexion.context['token_info']["id"]

    # Check status of subscription of organisation
    user = current_app.session.query(EvotorUser).filter_by(id=user_id).one()
    org = current_app.session.query(Organisation).filter_by(id=user.organisation).one()
    logger.info(f"Found org: {org} and user: {user}")

    if org.evotor_status != "SubscriptionCreated" and \
            org.evotor_status != "SubscriptionRenewed" and \
            org.evotor_status != "SubscriptionActivated":
        current_app.session.remove()
        return {}, 402

    erc20_jrc1_bonus = JRC1BonusERC20(org.loyalty_address)
    loyalty_params = erc20_jrc1_bonus.edit_loyalty_params([
        accrual_percent, min_accrual_threshold * 10 ** 18, accrual_rate * 10 ** 18,
        max_write_off_percent, is_simultaneous
    ])

    current_app.session.remove()

    return {}, 202
