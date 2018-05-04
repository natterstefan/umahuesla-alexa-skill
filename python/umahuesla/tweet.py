import graphene

from graphene.types import datetime
from sqlalchemy import Column, String, Integer, DateTime

from umahuesla.db import Base, BaseModelMixin


class TweetModel(Base, BaseModelMixin):
    """ The category SQL Alchemy model."""

    __tablename__ = 'tweets'

    uid = Column(Integer, primary_key=True)
    update_date = Column(DateTime)
    title_text = Column(String)
    main_text = Column(String)
    stream_id = Column(String)
    video_url = Column(String)


class Tweet(graphene.ObjectType):

    uid = graphene.String()
    update_date = datetime.DateTime()
    title_text = graphene.String()
    main_text = graphene.String()
    stream_url = graphene.String()
    video_url = graphene.String()

    def __init__(self, tweet):
        self._model = tweet
        super().__init__(
            uid=str(tweet.uid),
            update_date=tweet.update_date,
            title_text=tweet.title_text,
            main_text=tweet.main_text,
            video_url=tweet.video_url,
        )

    def resolve_stream_url(self, info):
        if self._model.stream_id:
            return f"http://localhost:9090/v1/files/{self._model.stream_id}"


class Query(object):

    latest_tweets = graphene.List(
        Tweet
    )

    def resolve_latest_tweets(self, info):
        items = TweetModel.query().order_by(
            TweetModel.update_date.desc()
        ).limit(5).all()
        return [Tweet(item) for item in items]