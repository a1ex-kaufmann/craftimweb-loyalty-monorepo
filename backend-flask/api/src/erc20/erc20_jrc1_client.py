import json
from typing import Tuple
from uuid import uuid4

from eth_abi import decode_abi, encode_abi
from web3 import Web3

from config import ConfigCJrc1Contract
from src.erc20.utils import get_interface
from src.log import get_logger

logger = get_logger("erc20_jrc1")


class JRC1BonusERC20:
    def __init__(self, address_contract: str = ConfigCJrc1Contract.CONTRACT):
        self.w3 = Web3(Web3.HTTPProvider(ConfigCJrc1Contract.NODE))

        interface = get_interface(ConfigCJrc1Contract.PATH_ABI)
        self.bytecode = interface["bytecode"]

        self.sc = self.w3.eth.contract(
            Web3.toChecksumAddress(address_contract), abi=json.dumps(interface["abi"])
        )

        logger.info(f"Connect to contract: {address_contract}")

        self.sender = ConfigCJrc1Contract.SENDER
        self.private = ConfigCJrc1Contract.PRIVATE

    def _create_and_sign_tx(self, func):
        estimate_gas = func.estimateGas({"from": self.sender}, block_identifier="pending")
        logger.debug(f"Estimate gas: {estimate_gas}")

        return self.w3.eth.account.sign_transaction(
            func.buildTransaction(
                {
                    "nonce": self.w3.eth.getTransactionCount(self.sender, "pending"),
                    "gasPrice": self.w3.eth.gas_price,
                    "from": self.sender,
                    "gas": estimate_gas,
                }
            ),
            private_key=self.private,
        )

    #
    # Write functions
    #

    def edit_loyalty_params(self, new_parameters: list) -> str:
        """
        Edit loyalty's params

        :param new_parameters: all params of loyalty:
        [accrualPercent, minAccrualThreshold, accrualRate,
        maxWriteoffPercent, bonusActivationDelay, bonusLifetime, isSimultaneous]
        :return: tx of operation
        """

        logger.debug(f"Edit loyalty, new parameters: {new_parameters}")

        encoded_params = encode_abi(self.get_loyalty_params_ABI(), new_parameters)

        func = self.sc.functions.editSettings(encoded_params)

        if not func.call({"from": self.sender}):
            return ""

        logger.info(f"Is valid edit_loyalty_params")

        signed_tx = self._create_and_sign_tx(func)
        tx = self.w3.eth.sendRawTransaction(signed_tx.rawTransaction)

        logger.info(f"edit_loyalty_params tx: {tx.hex()}")

        return tx.hex()

    def make_purchase(
        self, address: str, bonus_payment: int, sum_total: int, commit: bool
    ) -> Tuple[str, int, int, int]:
        """
        Make purchase for user

        :param address: user's wallet
        :param bonus_payment: sum bonuses with with kopecks
        :param sum_total: sum total with with kopecks
        :param commit: perform purchase or not
        :return: 1 - tx of operation, 2- sum with discount, 3 - accrued, 4 - write off bonuses
        """

        logger.debug(
            f"Make purchase. {address=}, {bonus_payment=}, {sum_total=}, {commit=}"
        )

        assert Web3.isAddress(address)

        purchase_id = uuid4().int
        logger.info(f"Purchase id: {purchase_id}")

        encoded_params = encode_abi(
            self.get_purchase_ABI_in(), [address, purchase_id, bonus_payment, sum_total, "1", 1, b"0x0a"]
        )

        func = self.sc.functions.makePurchase(encoded_params)
        output_params = decode_abi(
            self.get_purchase_ABI_out(), func.call({"from": self.sender}, block_identifier="pending")
        )

        sum_with_discount, accrued, written_off = (
            output_params[0],
            output_params[1],
            output_params[2],
        )

        logger.info(
            f"Is valid make_purchase: {sum_with_discount/10**18=}, {accrued/10**18=}, {written_off/10**18=}"
        )

        tx = b""
        if commit:
            signed_tx = self._create_and_sign_tx(func)
            tx = self.w3.eth.sendRawTransaction(signed_tx.rawTransaction)

            logger.info(f"make_purchase tx: {tx.hex()}")

        return tx.hex(), sum_with_discount, accrued, written_off

    def cancel_purchase(self, purchase_id: str) -> bool:
        """
        Cancel user purchase

        :param purchase_id: id of the purchase that will be returned
        :return: true if the purchase was returned successfully, false otherwise
        """

        logger.debug(f"Cancel purchase, {purchase_id=}")

        func = self.sc.functions.cancelPurchase(purchase_id)
        func_response = func.call({"from": self.sender}, block_identifier="pending")
        logger.info(f"Cancel Purchase response: {func_response}")

        signed_tx = self._create_and_sign_tx(func)
        tx = self.w3.eth.sendRawTransaction(signed_tx.rawTransaction)

        logger.info(f"cancel_purchase tx: {tx.hex()}")

        return func_response

    def create_user(self, address: str, foreign_key: str) -> Tuple[str, str]:
        """
        Register new user in loyalty

        :param foreign_key: user's foreign_key
        :param address: user's wallet
        :return: tx of operation
        """
        logger.info(f"Create user with: {address=}, {foreign_key=}")
        assert Web3.isAddress(address)

        checksum_address = Web3.toChecksumAddress(address)

        hash_phone = ""
        if foreign_key:
            hash_phone = Web3.solidityKeccak(["string"], [foreign_key])

        encoded_params = encode_abi(self.get_user_ABI_in(), [foreign_key])

        func = self.sc.functions.createUser(checksum_address, encoded_params)

        logger.info(f"Is valid create_user: {func.call({'from': self.sender}, block_identifier='pending')}")

        signed_tx = self._create_and_sign_tx(func)
        print(signed_tx.rawTransaction)
        tx = self.w3.eth.sendRawTransaction(signed_tx.rawTransaction)

        logger.info(f"create_user tx: {tx.hex()}")

        return tx.hex(), hash_phone

    #
    # Read functions
    #
    def get_bytecode(self):
        """
        Get bytecode of loyalty

        :return: bytecode of loyalty
        """

        return self.bytecode

    def get_loyalty_params_ABI(self) -> list:
        params_abi = self.sc.functions.SETTINGS_ABI().call(block_identifier="pending")
        logger.debug(f"ABI of loyalty settings: {params_abi}")
        return params_abi.split(",")

    def get_purchase_ABI_in(self) -> list:
        purchase_abi = self.sc.functions.PURCHASE_ABI_IN().call(block_identifier="pending")
        logger.debug(f"Purchase abi in: {purchase_abi}")
        return purchase_abi.split(",")

    def get_purchase_ABI_out(self) -> list:
        purchase_abi = self.sc.functions.PURCHASE_ABI_OUT().call(block_identifier="pending")
        logger.debug(f"Purchase abi out: {purchase_abi}")
        return purchase_abi.split(",")

    def get_user_ABI_in(self) -> list:
        """
        Get user's ABI for input parameters

        :return: input parameters
        """

        user_abi_in = self.sc.functions.USER_ABI_IN().call(block_identifier="pending")
        logger.debug(f"User ABI in: {user_abi_in}")
        return user_abi_in.split(",")

    def get_user_ABI_out(self) -> list:
        """
        Get user's ABI for output parameters

        :return: output parameters
        """

        user_abi_out = self.sc.functions.USER_ABI_OUT().call(block_identifier="pending")
        logger.debug(f"User ABI out: {user_abi_out}")
        return user_abi_out.split(",")

    def get_loyalty_params(self) -> list:
        """
        Get loyalty's settings
        !!! все рублевые и токенные суммы изменяются в wei (10^(-18))

        :return: loyalty settings
        [accrualPercent - курс начисления бонусных баллов в проценте (от 0 до 100, 5 = 5%),
        minAccrualThreshold - минимальная сумма покупки, при которой производится начисление бонусных баллов (1 руб 00 коп = 1*10^18)
        writeoffRate - курс списания бонусного балла (рублей за балл, 1 руб 00 коп = 1*10^18),
        maxWriteoffPercent - процент покупки, который может быть оплачен за счет бонусов (от 0 до 100, 5 = 5%),
        isSimultaneous - одновременное списание и начисление баллов]
        """
        encoded_loyalty_params = self.sc.functions.settings().call(block_identifier="pending")

        decoded_loyalty_params = decode_abi(
            self.get_loyalty_params_ABI(), encoded_loyalty_params
        )
        logger.info(f"loyalty_params: {decoded_loyalty_params}")

        return decoded_loyalty_params

    # def get_status(self):
    #     status = self.sc.functions.status().call()
    #     logger.info(f'Status: {status}')
    #     return status

    def get_user_details_by_wallet(self, address: str) -> list:
        """
        Get details by user's wallet

        :param address: user's wallet
        :return: 1 - is registered, 2 - number of purchases, 3 - amount of purchases, 4 - balance of bonuses in tokens
        """

        if not Web3.isAddress(address):
            address = "0x0000000000000000000000000000000000000000"

        checksum_address = Web3.toChecksumAddress(address)

        user_details = self.sc.functions.userDetails(checksum_address).call(
            block_identifier="pending"
        )

        user_details = decode_abi(self.get_user_ABI_out(), user_details)
        logger.info(f"Get user details: {user_details}")
        return user_details

    def get_wallet_by_foreign_card(self, foreign_card: str) -> str:
        """
        Get user's wallet by foreign card

        :param foreign_card: user's foreign card
        :return: user's address
        """

        user_wallet = self.sc.functions.userByForeignCard(foreign_card).call(
            block_identifier="pending"
        )

        logger.info(f"User's wallet by foreign card: {user_wallet}")
        return user_wallet

    def is_user_exist(self, address: str) -> bool:
        """
        Check exist user or not

        :param address: user's wallet
        :return: user is exist
        """

        if not Web3.isAddress(address):
            return False

        checksum_address = Web3.toChecksumAddress(address)

        is_user_exist = self.sc.functions.isUserExist(checksum_address).call(block_identifier="pending")
        logger.info(f"Is user exist: {is_user_exist}")
        return is_user_exist

    def get_total_users(self):
        total_users = self.sc.functions.totalUsers().call(block_identifier="pending")
        logger.info(f"Total users: {total_users}")
        return total_users

    # def get_erc20_tokens(self):
    #     erc20_tokens = self.sc.functions.erc20tokens().call()
    #     logger.info(f'ERC20 tokens: {erc20_tokens}')
    #     return erc20_tokens

    # de~f get_erc721_tokens(self):
    #     erc721_tokens = self.sc.functions.erc721tokens().call()
    #     logger.info(f'ERC721 tokens: {erc721_tokens}')
    #     return erc721_tokens

    def get_name(self):
        impl_name = self.sc.functions.implName().call(block_identifier="pending")
        logger.info(f"Implementation name: {impl_name}")
        return impl_name

    def get_generation(self):
        generation = self.sc.functions.implGeneration().call(block_identifier="pending")
        logger.info(f"Generation: {generation}")
        return generation

    def get_metadata(self):
        metadata = self.sc.functions.metadataURI().call(block_identifier="pending")
        logger.info(f"metadataURI: {metadata}")
        return metadata

    def create_public_key(self) -> str:
        account = self.w3.eth.account.create()
        logger.info(f"Create new public key: {account.address}")
        return account.address

    @staticmethod
    def hex_to_decimal(tx):
        if not tx:
            return 0

        logger.info(f"Hex: {tx} to decimal: {int(tx, 16)}")
        return int(tx, 16)

    @staticmethod
    def is_address(address: str):
        return Web3.isAddress(address)

    # #
    # # Event functions
    # #
    # def filter_initialize(self) -> list:
    #     initialize = self.sc.events.Initialize().createFilter(fromBlock='0x0').get_all_entries()
    #     logger.info(f'Filter initialize: {initialize}')
    #     # loyalty_deployed = list(map(dict, [loyalty["args"] for loyalty in loyalty_deployed]))
    #     return initialize
    #
    # def filter_edit_params(self) -> list:
    #     edit_loyalty_params = self.sc.events.EditParams().createFilter(fromBlock='0x0').get_all_entries()
    #     logger.info(f'Filter edit params: {edit_loyalty_params}')
    #     # loyalty_deployed = list(map(dict, [loyalty["args"] for loyalty in loyalty_deployed]))
    #     return edit_loyalty_params
    #
    # def filter_make_purchase(self) -> list:
    #     make_purchase = self.sc.events.MakePurchase().createFilter(fromBlock='0x0').get_all_entries()
    #     logger.info(f'Filter make purchase: {make_purchase}')
    #     # loyalty_deployed = list(map(dict, [loyalty["args"] for loyalty in loyalty_deployed]))
    #     return make_purchase
    #
    # def filter_create_user(self) -> list:
    #     create_user = self.sc.events.CreateUser().createFilter(fromBlock='0x0').get_all_entries()
    #     logger.info(f'Filter create user: {create_user}')
    #     # loyalty_deployed = list(map(dict, [loyalty["args"] for loyalty in loyalty_deployed]))
    #     return create_user
    #
    # def filter_change_status(self) -> list:
    #     change_status = self.sc.events.ChangeStatus().createFilter(fromBlock='0x0').get_all_entries()
    #     logger.info(f'Filter change status: {change_status}')
    #     # loyalty_deployed = list(map(dict, [loyalty["args"] for loyalty in loyalty_deployed]))
    #     return change_status
