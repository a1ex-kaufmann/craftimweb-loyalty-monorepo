from src.database import db_session
from src.erc20.erc20_router_client import RouterERC20
from src.evotor.models import Organisation
from src.log import get_logger

logger = get_logger("evotor_worker")
session = db_session()


def create_loyalty(org_id):
    logger.info(f"Task. Create loyalty: {org_id=}")

    # Get authorization token from DB
    orgranisation = session.query(Organisation).filter_by(id=org_id).one_or_none()

    if not orgranisation:
        session.close()
        return False

    erc20_router = RouterERC20()
    tx, owner, contract = erc20_router.deploy_loyalty([1, 1 * 10 ** 18, 1 * 10 ** 18, 100, True], b"", "my meta")

    orgranisation.loyalty_address = str(contract)

    session.add(orgranisation)
    session.commit()

    logger.info(f"Loyalty was created to org: {orgranisation}, contract: {contract}, owner: {owner}, tx: {tx}")

    session.close()
