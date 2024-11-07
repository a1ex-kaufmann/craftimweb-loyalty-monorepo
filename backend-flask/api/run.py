from config import FlaskConfig
from src.app import create_app

if __name__ == "__main__":
    connex_app = create_app()

    connex_app.run(
        port=FlaskConfig.PORT,
        debug=FlaskConfig.DEBUG
    )
