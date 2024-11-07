from datetime import datetime

import connexion
import phonenumbers
import pytz
from flask import current_app
from sqlalchemy.orm import exc

from config import FlaskConfig
from src.erc20.erc20_jrc1_client import JRC1BonusERC20
from src.evotor.models import Organisation
from src.log import get_logger
from src.users.models import User
from src.utils import LoyaltyAPI

logger = get_logger("users")


def get_all_users(
    _dmapptoken=None,
    auto: str = None,
    card=None,
    phone=None,
    email=None,
    gsrn=None,
    foreigncard=None,
    coupon=None,
):
    logger.info(
        f"get_all_users: {_dmapptoken=}, {auto=}, {card=}, {phone=}, {email=}, {gsrn=}, {foreigncard=}, {coupon=}. "
        f"Organisation id from token {connexion.context['token_info']}"
    )
    # logger.info(f"Headers: {connexion.request.headers}")

    # Check access
    if _dmapptoken not in FlaskConfig.DM_APP_TOKEN:
        response = {"errors": f"Not valid credentials dmapptoken: {_dmapptoken}"}
        logger.info(f"Response: {response}")
        return response, 401

    auto = auto.strip()
    wallet = auto.lower()

    # Get organisation from by id from token
    org_id = connexion.context["token_info"]["id"]
    organisation = current_app.session.query(Organisation).filter_by(id=org_id).one()
    erc20_jrc1_bonus = JRC1BonusERC20(organisation.loyalty_address)

    # SBP, do not touch Auto is foreign card or wallet
    if auto.lower().startswith("sbp") or auto.lower().startswith("jw1"):
        loyalty_api = LoyaltyAPI(org_id, auto)
        client, code = loyalty_api.get_client()
        logger.info(f"Response get client: {client=}, {code=}")

        if code == 200:
            wallet = client["External"]
        # If client reject registration
        elif code == 408:
            current_app.session.remove()
            return [], 408
        elif code == 403:
            current_app.session.remove()
            return [], 404
        # If client wasn't register. Need register
        elif code == 404:
            client, code = loyalty_api.register_client(auto)
            logger.info(f"Response register: {client=}, {code=}")

            if code == 403 or code == 404:
                current_app.session.remove()
                return [], 404
            elif code == 408:
                current_app.session.remove()
                return [], 408
            elif code == 406:
                wallet = client.get("External")
                if not wallet:
                    wallet = erc20_jrc1_bonus.create_public_key()
                    client, code = loyalty_api.get_client()
                    logger.info(f"Response get client: {client=}, {code=}")
                    client, code = loyalty_api.edit_client(wallet, client.get("Client"))
                    logger.info(f"Response edit client: {client=}, {code=}")

                    if code != 200:
                        current_app.session.remove()
                        return [], 400

            elif code == 200:
                wallet = client.get("External")

                if not wallet:
                    wallet = erc20_jrc1_bonus.create_public_key()
                    client, code = loyalty_api.get_client()
                    logger.info(f"Response get client: {client=}, {code=}")
                    client, code = loyalty_api.edit_client(wallet, client.get("Client"))
                    logger.info(f"Response edit client: {client=}, {code=}")

                    if code != 200:
                        current_app.session.remove()
                        return [], 400

                # Check on exist user
                user_details = erc20_jrc1_bonus.get_user_details_by_wallet(wallet)
                if not user_details[0]:
                    # Create user, write to DB and return 201
                    tx, hash_phone = erc20_jrc1_bonus.create_user(wallet, wallet[:15])

                current_app.session.remove()

                result = []
                result.append(
                    {
                        "id": int(wallet, 16),  # in contract "wallet in decimal"
                        "card": wallet[:20],
                        "discount": 0,
                        "amount": f"{0:.2f}",
                        "purchases": 0,  # in contract
                        "bonus": 0,  # in contract
                        "first_name": wallet[:10],
                        "last_name": "",
                        "middle_name": "",
                        "photo_urls": {  # TODO remove these links and check, app is crash or not
                            "100x125": FlaskConfig.HOST_URL + "static/img/user/templates/default/avatar-100x100.png",
                            "50x62": FlaskConfig.HOST_URL + "static/img/user/templates/default/avatar-50x50.png",
                        },
                        "coupons_url": FlaskConfig.HOST_URL + "20130701/users/2572214/coupons/",
                        # TODO remove these links and check, app is crash or not
                        "purchases_url": f"{FlaskConfig.HOST_URL}20130701/users/{auto}/purchases/",
                        "loyalty_url": f"{FlaskConfig.HOST_URL}20130701/loyalties/1/dmcard/{auto}",
                        "url": f"{FlaskConfig.HOST_URL}20130701/users/{auto}"
                        # TODO remove these links and check, app is crash or not
                    }
                )

                logger.info(f"Response: {result}")

                return result, 200

            else:
                current_app.session.remove()
                return [], 400
    # ========= SBP, do not touch Auto is foreign card or wallet

    elif JRC1BonusERC20.is_address(auto):
        wallet = auto.lower()
    else:
        try:
            phone = phonenumbers.parse(auto, "RU")
            auto = phonenumbers.format_number(
                phone, phonenumbers.PhoneNumberFormat.E164
            )
        except Exception as e:
            logger.debug(f"Error in parse phone: {auto}, {e}")

        wallet = erc20_jrc1_bonus.get_wallet_by_foreign_card(auto).lower()

    # Find user in blockchain
    user_details = erc20_jrc1_bonus.get_user_details_by_wallet(wallet)

    created_user, number_purchase = user_details[0], user_details[1]
    amount_purchases, user_bonuses = user_details[2], user_details[3]
    logger.info(
        f"User detail in SC: {created_user=}, {number_purchase=}, "
        f"{amount_purchases=}, {user_bonuses=}"
    )
    user_id = int(wallet, 16)
    user_bonuses /= 10 ** 18
    amount_purchases /= 10 ** 18

    if created_user:
        try:
            user_db = current_app.session.query(User).filter_by(wallet=wallet).one()
            logger.info(f"Found user in DB: {user_db}")
            foreign_card = user_db.foreign_card
            full_name = user_db.full_name
        except exc.NoResultFound as e:
            logger.info(f"Not found user in DB, wallet: {wallet}")
            foreign_card = wallet[:20]
            full_name = wallet[:10]
        current_app.session.remove()

        result = []

        if auto.lower().startswith("sbp") or auto.lower().startswith("jw1"):
            wallet = auto

        result.append(
            {
                "id": user_id,  # in contract "wallet in decimal"
                "card": foreign_card,
                "discount": 0,
                "amount": f"{amount_purchases:.2f}",
                "purchases": number_purchase,  # in contract
                "bonus": user_bonuses,  # in contract
                "first_name": full_name,
                "last_name": "",
                "middle_name": "",
                "photo_urls": {  # TODO remove these links and check, app is crash or not
                    "100x125": FlaskConfig.HOST_URL + "static/img/user/templates/default/avatar-100x100.png",
                    "50x62": FlaskConfig.HOST_URL + "static/img/user/templates/default/avatar-50x50.png",
                },
                "coupons_url": FlaskConfig.HOST_URL + "20130701/users/2572214/coupons/",
                # TODO remove these links and check, app is crash or not
                "purchases_url": f"{FlaskConfig.HOST_URL}20130701/users/{wallet}/purchases/",
                "loyalty_url": f"{FlaskConfig.HOST_URL}20130701/loyalties/1/dmcard/{wallet}",
                "url": f"{FlaskConfig.HOST_URL}20130701/users/{wallet}"
                # TODO remove these links and check, app is crash or not
            }
        )

        logger.info(f"Response: {result}")

        return result, 200

    else:
        current_app.session.remove()
        return [], 404


def create_users():
    message = f"create_users"
    logger.info(message)
    return message, 200


def get_user(user_id):
    message = f"Get_user: {user_id=}"
    logger.info(message)
    return {}, 404


def edit_user(user_id):
    message = f" edit_user: {user_id=}"
    logger.info(message)
    return message, 200


def get_coupons_by_user(user_id):
    message = f"get_coupons_by_user: {user_id=}"
    logger.info(message)
    return message, 200


def get_coupon(user_id, id):
    message = f"get_coupon: {user_id=}, {id=}"
    logger.info(message)
    return message, 200


def get_purchases_by_user(user_id):
    message = f"get_purchases_by_user: {user_id}"
    logger.info(message)
    return message, 200


def create_purchase_id(user_id, id):
    message = f"create_purchase: {user_id=}\nInput parameters: {connexion.request.form}"
    logger.info(message)
    return {}, 201


def create_purchase(user_id, _dmapptoken=None):
    logger.info(
        f"create_purchase: {_dmapptoken=}, {user_id=}\nInput parameters: {connexion.request.form}. "
        # f"Organisation id from token {connexion.context['token_info']}"
    )

    # Check access
    # if _dmapptoken not in FlaskConfig.DM_APP_TOKEN:
    #     return {"errors": "Not valid credentials"}, 401

    # Get organisation from by id from token
    # org_id = connexion.context["token_info"]["id"]
    # organisation = current_app.session.query(Organisation).filter_by(id=org_id).one()
    # erc20_jrc1_bonus = JRC1BonusERC20(organisation.loyalty_address)
    erc20_jrc1_bonus = JRC1BonusERC20("0x1a70603Fd6660f3CCeE1A0a17eBC33192930f735")
    current_app.session.remove()

    is_commit = True if connexion.request.form.get("commit") == "true" else False

    bonus_payment = float(connexion.request.form["bonus_payment"])
    sum_total = float(connexion.request.form["sum_total"])
    wallet = user_id

    # if wallet.lower().startswith("sbp") or wallet.lower().startswith("jw1"):
    #     loyalty_api = LoyaltyAPI(org_id, wallet)
    #     client, code = loyalty_api.get_client()
    #     logger.info(f"Response get client: {client=}, {code=}")

    #     if code == 200:
    #         wallet = client["External"]
    #     else:
    #         return {}, 400

    # Find user in blockchain
    user_details = erc20_jrc1_bonus.get_user_details_by_wallet(wallet)

    created_user, user_purchases = user_details[0], user_details[1]
    amount_purchases, user_bonuses = user_details[2], user_details[3]
    logger.info(
        f"User detail in SC: {created_user=}, {user_purchases=}, "
        f"{amount_purchases=}, {user_bonuses=}"
    )

    # Make purchase
    if not created_user:
        erc20_jrc1_bonus.create_user(wallet, wallet)
        # return {"errors": "User not found in blockchain"}, 404

    tx, total_sum_with_discount, accrued, write_off = erc20_jrc1_bonus.make_purchase(
        wallet, int(bonus_payment * 10 ** 18), int(sum_total * 10 ** 18), is_commit
    )

    total_sum_with_discount /= 10 ** 18
    accrued /= 10 ** 18
    write_off /= 10 ** 18
    user_bonuses /= 10 ** 18

    items = []
    remain_bonuses = bonus_payment
    for i, v in enumerate(connexion.request.form):
        if f"item_{i}_gtin" not in connexion.request.form:
            break

        item_sum = float(connexion.request.form[f"item_{i}_sum"])
        if remain_bonuses <= item_sum:
            sum_with_discount = item_sum - remain_bonuses
            remain_bonuses = 0
        else:
            sum_with_discount = 0
            remain_bonuses -= item_sum

        items.append(
            {
                "item_gtin": connexion.request.form[f"item_{i}_gtin"],
                "item_code": connexion.request.form[f"item_{i}_id"],
                "group_code": connexion.request.form[f"item_{i}_gid"],
                "quantity": connexion.request.form[f"item_{i}_q"],
                "sum_total": connexion.request.form[f"item_{i}_sum"],
                "sum_with_discount": f"{sum_with_discount:.2f}",
            }
        )

    id_purchase = JRC1BonusERC20.hex_to_decimal(tx) % 10 ** 7

    response = {
        "id": id_purchase,
        "doc_id": connexion.request.form.get("doc_id") or "",
        "pos": "pos1",
        "discount": int(write_off / sum_total * 100),
        "sum_bonus": -write_off if bonus_payment != 0 else accrued,
        "sum_discount": f"{write_off:.2f}",
        "sum_total": sum_total,
        "date": datetime.now(pytz.timezone("Europe/Moscow")).strftime(
            "%Y-%m-%d %H:%M:%S %z"
        ),
        "curr_iso_code": 643,
        "curr_iso_name": "RUB",
        "override": False,
        "items": items,
        "items_url": f"{FlaskConfig.HOST_URL}20130701/users/{wallet}/purchases/{id_purchase}/items/",
        "coupons": None,
        "coupons_url": f"{FlaskConfig.HOST_URL}20130701/users/{wallet}/coupons/?id={id_purchase}"
        if is_commit
        else None,
        "bonus": {
            "accrued": accrued,
            "written_off": write_off,
            "balance": user_bonuses,
            "balance_inactive": 0.0,
        },
        "url": f"{FlaskConfig.HOST_URL}20130701/users/{wallet}/purchases/{id_purchase}"
        if is_commit
        else None,
    }
    logger.info(f"Response: {response}")
    return response, 201 if is_commit else 200


def get_purchase(user_id, id):
    message = f"get_purchase: {user_id=}, {id=}"
    logger.info(message)
    return message, 200


def delete_purchase(user_id, id, _dmapptoken=None):
    logger.info(
        f"delete_purchase: {_dmapptoken=}, {user_id=}\nInput parameters: {connexion.request.form}. "
        f"Organisation id from token {connexion.context['token_info']}"
    )

    # # Check access
    # if _dmapptoken not in FlaskConfig.DM_APP_TOKEN:
    #     return {"errors": "Not valid credentials"}, 401

    # Get organisation from by id from token
    org_id = connexion.context["token_info"]["id"]
    organisation = current_app.session.query(Organisation).filter_by(id=org_id).one()
    erc20_jrc1_bonus = JRC1BonusERC20(organisation.loyalty_address)
    current_app.session.remove()

    wallet = user_id

    if wallet.lower().startswith("sbp") or wallet.lower().startswith("jw1"):
        loyalty_api = LoyaltyAPI(org_id, wallet)
        client, code = loyalty_api.get_client()
        logger.info(f"Response get client: {client=}, {code=}")

        if code == 200:
            wallet = client["External"]
        else:
            return {}, 400

    # Cancel purchase
    purchase_cancelled = erc20_jrc1_bonus.cancel_purchase(id)
    logger.info(f"{purchase_cancelled=}")

    return None, 204
