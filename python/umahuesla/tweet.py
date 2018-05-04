import graphene

from sqlalchemy import Column, String, Integer, DateTime

from umahuesla.db import Base, BaseModelMixin

from . import types


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
    update_date = types.DateTime()
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
        # gql.server is the value the export UH_GQL_SERVER
        if self._model.stream_id:
            host = info.context.registry.settings.get(
                "gql.server",
                "http://localhost:9090"
            )
            return f"{host}/v1/files/{self._model.stream_id}"


class Query(object):

    latest_tweets = graphene.List(
        Tweet
    )

    def resolve_latest_tweets(self, info):
        items = TweetModel.query().order_by(
            TweetModel.update_date.desc()
        ).limit(5).all()
        return [Tweet(item) for item in items]
