from datetime import datetime

import connexion
import phonenumbers
from flask import current_app
from sqlalchemy.orm import exc

from config import FlaskConfig
from src.erc20.erc20_jrc1_client import JRC1BonusERC20
from src.evotor.models import Organisation
from src.log import get_logger
from src.users.models import User

logger = get_logger("cards")


def get_all_users():
    message = f"Current unix timestamp: {int(datetime.timestamp(datetime.now()))}"
    logger.info(message)
    return message, 200


def create_cards(_dmapptoken=None):
    logger.info(f"create_cards (new user), {_dmapptoken=} input parameters body: {connexion.request.form}")

    # Check access terminal
    # if _dmapptoken not in FlaskConfig.DM_APP_TOKEN:
    #     return {"errors": "Not valid credentials"}, 401

    # Get organisation from by id from token
    org_id = connexion.context['token_info']["id"]
    organisation = current_app.session.query(Organisation).filter_by(id=org_id).one()
    erc20_jrc1_bonus = JRC1BonusERC20(organisation.loyalty_address)

    # Extract data from body request
    wallet = connexion.request.form.get("code").lower() or ""
    wallet = wallet.strip()
    full_name = connexion.request.form.get("full_name") or ""
    foreign_card = connexion.request.form.get("phone") or ""
    foreign_card = foreign_card.strip()
    birthday = connexion.request.form.get("birthday") or datetime.fromtimestamp(0).date()
    if birthday and type(birthday) == str:
        birthday = datetime.strptime(birthday, '%Y-%m-%d').date()

    try:
        phone = phonenumbers.parse(foreign_card, "RU")
        foreign_card = phonenumbers.format_number(phone, phonenumbers.PhoneNumberFormat.E164)
    except Exception as e:
        logger.debug(f"Error in parse phone: {foreign_card}, {e}")

    if not foreign_card:
        foreign_card = wallet[:15]

    # Required data
    if not wallet:
        current_app.session.remove()
        return {"errors": "Wallet required"}, 400

    # Create user if one created then overwrite else
    user = User(wallet=wallet, full_name=full_name, birthday=birthday)

    try:
        user_db = current_app.session.query(User).filter_by(wallet=wallet).one()
        user_db.foreign_card = user.foreign_card
        user_db.full_name = user.full_name
        user_db.birthday = user.birthday
        user = user_db
    except exc.NoResultFound as e:
        pass

    # Check on exist user
    user_details = erc20_jrc1_bonus.get_user_details_by_wallet(wallet)
    if not user_details[0]:
        # Create user, write to DB and return 201
        tx, hash_phone = erc20_jrc1_bonus.create_user(wallet, foreign_card)
        user.tx = tx
        user.foreign_card = foreign_card

    current_app.session.add(user)
    current_app.session.commit()

    logger.info(f"Create/update user in DB: {user}")

    if user.tx:
        response = {
            "foreigncard": wallet,
            "DIN": user.tx[:50],
            "ID": user.tx[:50]
        }

        current_app.session.remove()

        logger.info(f"Response: {response}")

        return response, 201
    else:
        response = {"errors": f"User exist with foreign card: \"{user.foreign_card}\""}
        current_app.session.remove()
        logger.info(f"Response: {response}")
        return response, 409
