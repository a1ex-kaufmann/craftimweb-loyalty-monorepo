import json

from eth_abi import encode_abi
from web3 import Web3

from config import ContractRouterConfig
from src.erc20.utils import get_interface
from src.log import get_logger
from src.erc20.erc20_jrc1_client import JRC1BonusERC20

logger = get_logger("erc20_router")


class RouterERC20:

    def __init__(self):
        self.w3 = Web3(Web3.HTTPProvider(ContractRouterConfig.NODE))

        # self.sender = self.w3.eth.account.privateKeyToAccount(ContractRouterConfig.PRIVATE).address
        interface = get_interface(ContractRouterConfig.PATH_ABI)
        self.bytecode = json.dumps(interface["bytecode"])
        self.sc = self.w3.eth.contract(
            Web3.toChecksumAddress(ContractRouterConfig.CONTRACT),
            abi=json.dumps(interface["abi"]))

        self.sender = ContractRouterConfig.SENDER
        self.private = ContractRouterConfig.PRIVATE

        # logger.info(f'Address: {self.sender}')
        # logger.info(f'Balance: {self.w3.eth.getBalance(self.sender) * 10 ** -18} joys')

    def _create_and_sign_tx(self, func):
        estimate_gas = func.estimateGas({'from': self.sender})
        logger.debug(f"Estimate gas: {estimate_gas}")

        return (self.w3.eth.account.sign_transaction(func.buildTransaction({
            'nonce': self.w3.eth.getTransactionCount(self.sender, 'pending'),
            'gasPrice': self.w3.eth.gas_price,
            'from': self.sender,
            'gas': estimate_gas
        }), private_key=self.private))

    #
    # Write functions
    #
    def deploy_loyalty(self, parameters: list, other_data: bytes, meta_data: str):
        """

        :param parameters:
        :return: owner, address
        """
        erc20_jrc1_bonus_pro = JRC1BonusERC20()
        encoded_parameters = encode_abi(erc20_jrc1_bonus_pro.get_loyalty_params_ABI(), parameters)
        bytecode = erc20_jrc1_bonus_pro.get_bytecode()

        logger.info(f"Bytecode: {bytecode[:100]}, {encoded_parameters=}")

        encoded_other_data = encode_abi(["string", "string"], ["name1", "symbol1"])

        func = self.sc.functions.deployAndRegister(bytecode, encoded_parameters, encoded_other_data, meta_data)

        contract, entity_id, owner = func.call({"from": self.sender})
        logger.info(f"{owner=}, {contract=}, {entity_id=}")

        logger.info(f'Is valid edit_loyalty_params')

        signed_tx = self._create_and_sign_tx(func)
        tx = self.w3.eth.sendRawTransaction(signed_tx.rawTransaction)

        logger.info(f'deploy_loyalty tx: {tx.hex()}')

        return tx.hex(), owner, contract

    #
    # Read functions
    #
    def get_core_contract(self):
        core_contract = self.sc.functions.coreContract().call()
        logger.info(f'Core contract: {core_contract}')
        return core_contract

    def get_entity_list_by_user(self, address: str):
        entity_list_by_user = self.sc.functions.entityListByUser(address).call()
        logger.info(f'Entity list by user: {entity_list_by_user}')
        return entity_list_by_user

    #
    # Event functions
    #
    def filter_loyalty_deployed(self) -> list:
        loyalty_deployed = self.sc.events.LoyaltyDeployed().createFilter(fromBlock='0x0').get_all_entries()
        logger.info(f'Filter loyalty deployed: {loyalty_deployed}')
        # loyalty_deployed = list(map(dict, [loyalty["args"] for loyalty in loyalty_deployed]))
        return loyalty_deployed
