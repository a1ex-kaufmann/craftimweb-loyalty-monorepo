class FlaskConfig:
    LOG_FILE = "//sc_api/api/data/logs/logs.log"
    PATH_TO_DB = "sqlite:////data/sqlite.db"

    PORT = 5000
    DEBUG = False

    EVOTOR_API_KEY = "admin"

    DM_APP_TOKEN = ""

    SECRET_KEY = "SECRET_KEY"


class ContractConfig:
    NODE = "https://node.joys.digital"
    SENDER = ""
    PRIVATE = ""


class ConfigCoreContract(ContractConfig):
    PATH_ABI = "api/src/erc20/LoyaltyCore.json"
    CONTRACT = ""


class ConfigCJrc1Contract(ContractConfig):
    PATH_ABI = "api/src/erc20/JRC1Bonus.json"
    CONTRACT = ""


class ContractRouterConfig(ContractConfig):
    PATH_ABI = "api/src/erc20/LoyaltyRouter.json"
    CONTRACT = ""
