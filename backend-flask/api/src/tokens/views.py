from datetime import datetime

import connexion
from flask import current_app

from config import FlaskConfig
from src.evotor.models import EvotorUser
from src.log import get_logger
from src.utils import encode_token, decode_auth_token

logger = get_logger("tokens")


def create_token():
    logger.info(f"Crete token, input parameters: {connexion.request.form}")
    logger.info(f"Headers: {connexion.request.headers}")

    # Extract data
    evotor_user_id = connexion.request.headers.get("X-Evotor-User-Id")
    if not evotor_user_id:
        response = {"errors": "Required header: X-Evotor-User-Id"}
        logger.info(f"Response: {response}")
        return response, 401

    # Find evotor user
    evotor_user = current_app.session.query(EvotorUser).filter_by(evotor_user_id=evotor_user_id).one_or_none()
    logger.info(f"Found evotor user: {evotor_user}")

    if evotor_user:
        # Create JWT token
        jwt_token = encode_token(evotor_user.id, FlaskConfig.SECRET_KEY)
        logger.info(f"Token was created, token: {jwt_token}")

        response = {
            "token": jwt_token,
            "token_url": f"{FlaskConfig.HOST_URL}20130701/tokens/{jwt_token}"
        }
        current_app.session.remove()
        logger.info(f"Response: {response}")
        return response, 201
    else:
        current_app.session.remove()
        response = {"errors": "Not found evotor user"}
        logger.info(f"Response: {response}")
        return response, 401


def get_token(token):
    logger.info(f"Get token, input parameters: {token=}")
    logger.info(f"Headers: {connexion.request.headers}")

    # Check JWT token
    input_user_id = decode_auth_token(token, FlaskConfig.SECRET_KEY)
    logger.info(f"Input user id: {input_user_id}")

    if type(input_user_id) != int and "invalid" in input_user_id.lower():
        response = {"errors": "Invalid credentials"}
        logger.info(f"Response: {response}")
        return response, 401

    if type(input_user_id) != int and "expired" in input_user_id.lower():
        response = {"errors": "Expired credentials"}
        logger.info(f"Response: {response}")
        return response, 401

    # Validation data
    if current_app.session.query(EvotorUser).filter_by(id=input_user_id).one_or_none():
        current_app.session.remove()
        response = {
            "active": True
        }
        logger.info(f"Response: {response}")
        return response, 200
    else:
        current_app.session.remove()
        response = {"errors": "User not found"}
        logger.info(f"Response: {response}")
        return response, 401


def delete_token(token):
    logger.info(f"Delete token, input parameters: {connexion.request.form}, {token=}")
    logger.info(f"Headers: {connexion.request.headers}")
    message = {"errors": f"Current unix timestamp: {int(datetime.timestamp(datetime.now()))}"}
    logger.info(message)
    return message, 401
