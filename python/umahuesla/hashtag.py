from sqlalchemy import Column, String, Boolean

from umahuesla.db import Base, BaseModelMixin


class HashtagModel(Base, BaseModelMixin):

    __tablename__ = 'hashtags'

    tag = Column(String, primary_key=True)
    active = Column(Boolean)
