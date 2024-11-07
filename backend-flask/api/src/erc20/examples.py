# from api.src.erc20.erc20_core_client import CoreERC20
# import sys

from api.src.erc20.erc20_jrc1_client import JRC1BonusERC20

from api.src.erc20.erc20_router_client import RouterERC20

# Router's methods
# erc20_router = RouterERC20()
# print(erc20_router.deploy_loyalty([1, 1, 1 * 10 ** 18, 100, True], b"", "my meta"))
# 0xc7B8533eb34E326F6B8cb360966Dbc2d266e4F2C
# erc20_router.get_core_contract()
# erc20_router.filter_loyalty_deployed()
# erc20_router.get_entity_list_by_user("0xB12646688C6F7A7967a78fE2F9A9d3e45E7F1324")

# Core's methods
# erc20_core = CoreERC20()
# erc20_core.get_entity(0)
# erc20_core.get_entity_total()
# erc20_core.get_entity_count_of("0x38A2267C2c4De82fF0eC1574cc41316E156a4324")
# erc20_core.get_entity_list_of("0x38A2267C2c4De82fF0eC1574cc41316E156a4324")
# erc20_core.filter_entity_registered()
# erc20_core.filter_register_fee_changed()

# Bonus's methods
erc20_jrc1_bonus = JRC1BonusERC20("0xc7B8533eb34E326F6B8cb360966Dbc2d266e4F2C")
# wallet = erc20_jrc1_bonus.create_public_key()
# wallet = "0xA1534B13F5f9D5897e13843d17A46da38B40FBF1" # 89999999998
# wallet = "0xF1CE81C3bea7913A162867d75512832E7bA0246F"  # 89999999999
# print(wallet)
# erc20_jrc1_bonus.is_user_exist(wallet)
# erc20_jrc1_bonus.get_user_details_by_wallet(wallet)
# erc20_jrc1_bonus.get_wallet_by_foreign_card("89999999999")
# erc20_jrc1_bonus.make_purchase(wallet, bonus_payment=0, sum_total=150_00, commit=True)
# erc20_jrc1_bonus.create_user(wallet, "89999999998")
# erc20_jrc1_bonus.edit_loyalty_params([1, 1, 1 * 10 ** 18, 100, True])
# erc20_jrc1_bonus.get_loyalty_params()
# erc20_jrc1_bonus.get_total_users()
