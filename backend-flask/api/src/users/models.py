from sqlalchemy import Column, Integer, String, Date

from src.database import Base


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)

    wallet = Column(String(45))
    full_name = Column(String(150))
    foreign_card = Column(String(20))
    birthday = Column(Date(), default="1980-01-01")
    tx = Column(String(150))

    def __repr__(self):
        return f"<User({self.wallet}, {self.full_name}, {self.birthday}, {self.foreign_card}, {self.tx})>"
