from connexion.exceptions import OAuthProblem
from flask import current_app

from config import FlaskConfig
from src.evotor.models import EvotorUser, Organisation
from src.utils import decode_auth_token


def bearer_auth_adminsc(token):
    print(f"Authorize adminsc: {token}")

    # Check JWT token
    input_user_id = decode_auth_token(token, FlaskConfig.SECRET_KEY)
    print(f"Input user id: {input_user_id}")
    if type(input_user_id) != int and "invalid" in input_user_id.lower():
        print(f"Invalid credentials")
        return None

    if type(input_user_id) != int and "expired" in input_user_id.lower():
        print(f"Expired credentials")
        return None

    # Validation data

    if current_app.session.query(EvotorUser).filter_by(id=input_user_id).one_or_none():
        current_app.session.remove()
        return {'sub': 'admin', "id": input_user_id}
    else:
        print("Not found user")
        current_app.session.remove()
        return None


def bearer_auth_evotor(token):
    print(f"Authorize evotor: {token}")
    # if token == FlaskConfig.EVOTOR_API_KEY:
    return {'sub': 'admin'}


def bearer_auth_pos(token, required_scopes):
    print(f"Authorize pos: {token}")
    token = token.split(" ")[1]

    # Check JWT token
    input_user_id = decode_auth_token(token, FlaskConfig.SECRET_KEY)
    print(f"Input org id: {input_user_id}")

    if type(input_user_id) != int and "invalid" in input_user_id.lower():
        print(f"Invalid credentials")
        raise OAuthProblem('Invalid credentials')

    if type(input_user_id) != int and "expired" in input_user_id.lower():
        print(f"Expired credentials")
        raise OAuthProblem('Expired credentials')


    # Validation data
    if current_app.session.query(EvotorUser).filter_by(id=input_user_id).one_or_none():
        current_app.session.remove()
        print(f"Org authenticated")
        return {'sub': 'admin', "id": input_user_id}
    else:
        print("Not found org")
        current_app.session.remove()
        raise OAuthProblem('Not found org')
