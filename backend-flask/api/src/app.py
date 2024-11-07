import connexion
from connexion import RestyResolver
from flask import _app_ctx_stack
from flask_cors import CORS
from sqlalchemy.orm import scoped_session

from src.database import init_db, SessionLocal


def create_app():
    connex_app = connexion.FlaskApp(__name__, specification_dir='../open_api/')
    connex_app.add_api('openapi.yaml',
                       resolver=RestyResolver('api'),
                       options={"swagger_ui": True},
                       strict_validation=False
                       )
    CORS(connex_app.app)

    init_db()

    connex_app.app.session = scoped_session(SessionLocal, scopefunc=_app_ctx_stack.__ident_func__)

    return connex_app
