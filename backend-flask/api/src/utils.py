import datetime
import hashlib
import hmac
import os
from typing import Tuple

import jwt
import requests

from config import FlaskConfig


def hash_new_password(password: str) -> Tuple[bytes, bytes]:
    """
    Hash the provided password with a randomly-generated salt and return the
    salt and hash to store in the database.
    """
    salt = os.urandom(32)
    pw_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 110000)
    return salt, pw_hash


def is_correct_password(salt, pw_hash, password: str) -> bool:
    """
    Given a previously-stored salt and hash, and a password provided by a user
    trying to log in, check whether the password is correct.
    """
    return hmac.compare_digest(
        pw_hash,
        hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 110000)
    )


def encode_token(user_id, secret_key: str = "SECRET_KEY"):
    try:
        payload = {
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=365, minutes=0, seconds=0),
            "iat": datetime.datetime.utcnow(),
            "sub": user_id,
        }
        return jwt.encode(
            payload,
            secret_key,
            algorithm='HS256'
        )
    except Exception as e:
        return e


def decode_auth_token(auth_token, secret_key: str = "SECRET_KEY"):
    """
    Decodes the auth token
    :param auth_token:
    :return: integer|string
    """
    try:
        payload = jwt.decode(auth_token, secret_key, algorithms=["HS256"])
        return payload['sub']
    except jwt.ExpiredSignatureError:
        return 'Signature expired. Please log in again.'
    except jwt.InvalidTokenError:
        return 'Invalid token. Please log in again.'


class LoyaltyAPI:
    TIMEOUT = 30
    LOYALTY_ID = "1"
    HOST = FlaskConfig.HOST_LOYALTY_API

    def __init__(self, merchant: str, token: str, loyalty_id: str = LOYALTY_ID):
        self.session = requests.Session()
        self.session.headers.update({
            "content-type": "application/json"
        })

        self.merchant = str(merchant)
        self.token = str(token)
        self.loyalty_id = str(loyalty_id)

    def get_client(self):
        body = {
            "Query": "loyalty/get",
            "Request": {
                "Loyalty": self.loyalty_id,
                "Merchant": self.merchant,
                "Token": self.token
            }
        }

        url = f"{LoyaltyAPI.HOST}/loyal/"

        response = self.session.post(url, json=body, timeout=LoyaltyAPI.TIMEOUT)

        # return response.json().get("Reply"), response.status_code
        result = {}
        if response.content:
            print(f"Content {response.content}")
            result = response.json()
        return result.get("Reply"), response.status_code

    def register_client(self, token: str):
        body = {
            "Query": "loyalty/register",
            "Request": {
                "Loyalty": self.loyalty_id,
                "Merchant": self.merchant,
                "Token": token,
                "Fields": {
                    "External": True
                }
            }
        }

        url = f"{LoyaltyAPI.HOST}/loyal/"

        response = self.session.post(url, json=body, timeout=LoyaltyAPI.TIMEOUT)

        result = {}
        if response.content:
            print(f"Content {response.content}")
            result = response.json()
        return result.get("Reply"), response.status_code


    def edit_client(self, external: str, client: str):
        body = {
            "Query": "loyalty/update",
            "Request": {
                "Loyalty": self.loyalty_id,
                "Merchant": self.merchant,
                "Client": client,
                "External": external
            }
        }

        url = f"{LoyaltyAPI.HOST}/loyal/"

        response = self.session.post(url, json=body, timeout=LoyaltyAPI.TIMEOUT)

        # return response.json().get("Reply"), response.status_code
        result = {}
        if response.content:
            print(f"Content {response.content}")
            result = response.json()
        return result.get("Reply"), response.status_code


