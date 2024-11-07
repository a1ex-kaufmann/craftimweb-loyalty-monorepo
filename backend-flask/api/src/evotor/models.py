import datetime

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from src.database import Base


class EvotorUser(Base):
    __tablename__ = "evotor_user"

    id = Column(Integer, primary_key=True)
    username = Column(String(150))
    password = Column(String(100))
    evotor_user_id = Column(String(100))
    salt = Column(String(100))
    evotor_token = Column(String(50), nullable=True)
    organisation = Column(Integer, ForeignKey("organisation.id", ondelete="CASCADE"))

    def __repr__(self):
        return f"<EvotorUser({self.id}, {self.username}, {self.evotor_user_id})>"


class Organisation(Base):
    __tablename__ = "organisation"

    id = Column(Integer, primary_key=True)

    name = Column(String(150))
    evotor_status = Column(String(100), default="")
    amount_devices = Column(Integer, default=0)
    last_update = Column(DateTime, default=datetime.datetime.utcnow(), onupdate=datetime.datetime.utcnow())
    wallet = Column(String(43))
    trial_period_duration = Column(String(50), nullable=True)
    loyalty_address = Column(String(43), nullable=True)
    users = relationship("EvotorUser", cascade="all, delete")

    def __repr__(self):
        return f"<Organisation({self.id}, {self.name}, {self.amount_devices}, {self.wallet}, {self.loyalty_address}, {self.evotor_status})>"
