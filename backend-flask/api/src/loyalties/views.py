import connexion
from flask import current_app

from config import FlaskConfig
from src.erc20.erc20_jrc1_client import JRC1BonusERC20
from src.evotor.models import Organisation
from src.log import get_logger

logger = get_logger("loyalties")


def get_loyalty(merchant_id):
    message = f"get_loyalty: merchant_id {merchant_id}"
    logger.info(message)

    return message, 200


def get_loyalty_by_card(merchant_id, card, _dmapptoken=None):
    logger.info(
        f"get_loyalty_by_card: {_dmapptoken=}, {merchant_id=}, {card=}. Organisation id from token {connexion.context['token_info']}")

    # Check access
    # if _dmapptoken not in FlaskConfig.DM_APP_TOKEN:
    #     return {"errors": "Not valid credentials"}, 403

    # Get organisation from by id from token
    org_id = connexion.context['token_info']["id"]
    organisation = current_app.session.query(Organisation).filter_by(id=org_id).one()

    # Get params of loyalty
    erc20_jrc1_bonus = JRC1BonusERC20(organisation.loyalty_address)
    current_app.session.remove()

    loyalty_params = erc20_jrc1_bonus.get_loyalty_params()
    accrual_percent, min_accrual_threshold = loyalty_params[0], loyalty_params[1]
    write_off_rate, max_write_off_percent = loyalty_params[2], loyalty_params[3]
    is_simultaneous = loyalty_params[4]
    logger.info(f"Loyalty params: {accrual_percent=}, {min_accrual_threshold=}, "
                f"{write_off_rate=}, {max_write_off_percent=}, {is_simultaneous=}")
    write_off_rate /= 10 ** 18

    response = {
        "type": "bonus",
        "currency_code": 643,
        "currency_name": "RUB",
        "min_purchase_amount": int(min_accrual_threshold/10**18),  # in contract
        "amount_to_bonus": [  # in contract
            100,
            f"{accrual_percent * 100:.4f}"  # "100.0000"
        ],
        "bonus_to_amount": [  # in contract
            1,
            f"{write_off_rate:.4f}"  # "1.0000"
        ],
        "max_purchase_percentage": max_write_off_percent,  # in contract
        "expiration": 0  # in contract
    }

    logger.info(f"Response: {response}")

    return response, 200
