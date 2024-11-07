import json

from src.database import db_session, init_db
from src.evotor.models import Organisation, EvotorUser
from src.utils import hash_new_password

init_db()

session = db_session()

prepared_db = json.loads(open("api/data/populate.json", "r").read())

organisations = []
for org in prepared_db["organisations"]:
    organisations.append(Organisation(**org))
session.add_all(organisations)
session.commit()

evotor_users = []

for user in prepared_db["users"]:
    org = session.query(Organisation).filter_by(name=user["org_name"]).one()
    del (user["org_name"])
    salt, stored_pass = hash_new_password(user["password"])
    user["salt"], user["password"] = salt, stored_pass
    evotor_user = EvotorUser(**user)
    org.users.append(evotor_user)
    evotor_users.append(evotor_user)

session.add_all(evotor_users)

session.commit()
session.close()
