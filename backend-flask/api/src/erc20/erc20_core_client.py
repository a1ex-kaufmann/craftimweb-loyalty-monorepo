import json

from web3 import Web3

from api.config import ConfigCoreContract
from api.src.erc20.utils import get_interface
from api.src.log import get_logger

logger = get_logger("erc20_core")


class CoreERC20:

    def __init__(self, address_contract: str = ConfigCoreContract.CONTRACT):
        self.w3 = Web3(Web3.HTTPProvider(ConfigCoreContract.NODE))

        interface = get_interface(ConfigCoreContract.PATH_ABI)
        self.bytecode = interface["bytecode"]

        self.sc = self.w3.eth.contract(
            Web3.toChecksumAddress(address_contract),
            abi=json.dumps(interface["abi"]))

    #
    # Read functions
    #
    def get_entity(self, id_):
        entity = self.sc.functions.getEntity(id_).call()
        logger.info(f'Entity: {entity}')
        return entity

    def get_entity_total(self):
        entity_total = self.sc.functions.entityTotal().call()
        logger.info(f'Entity total: {entity_total}')
        return entity_total

    def get_entity_count_of(self, address: str):
        entity_count_of = self.sc.functions.entityCountOf(address).call()
        logger.info(f'Entity count of: {entity_count_of}')
        return entity_count_of

    def get_entity_list_of(self, address: str):
        entity_list_of = self.sc.functions.entityListOf(address).call()
        logger.info(f'Entity list of: {entity_list_of}')
        return entity_list_of

    #
    # Event functions
    #
    def filter_entity_registered(self) -> list:
        entity_registered = self.sc.events.EntityRegistered().createFilter(fromBlock='0x0').get_all_entries()
        logger.info(f'Filter entity registered: {entity_registered}')
        # loyalty_deployed = list(map(dict, [loyalty["args"] for loyalty in loyalty_deployed]))
        return entity_registered

    def filter_register_fee_changed(self) -> list:
        register_fee_changed = self.sc.events.RegisterFeeChanged().createFilter(fromBlock='0x0').get_all_entries()
        logger.info(f'Filter entity registered fee changed: {register_fee_changed}')
        # loyalty_deployed = list(map(dict, [loyalty["args"] for loyalty in loyalty_deployed]))
        return register_fee_changed
