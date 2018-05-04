import uuid

from pyramid.settings import aslist, asbool
from sqlalchemy import create_engine, func, sql
from sqlalchemy import event
from sqlalchemy.ext.declarative import declarative_base, DeclarativeMeta
from sqlalchemy.inspection import inspect
from sqlalchemy.orm import scoped_session, sessionmaker
from zope.sqlalchemy import register

from .blob import blobs

DBSession = scoped_session(sessionmaker())

ModelRegistry = {}


class ModelMeta(DeclarativeMeta):
    """Add the class to the model registry."""

    def __init__(cls, name, bases, dct):
        ModelRegistry[name] = cls
        super(ModelMeta, cls).__init__(name, bases, dct)


Base = declarative_base(metaclass=ModelMeta)


class BaseModelMixin(object):
    """A base model for all SQL Alchemy models."""

    session = DBSession

    def add_to_session(self):
        """Add the object to the database session."""
        self.session.add(self)
        return self

    def get_source(self):
        """This method returns the model as a dict.

        All columns and relationships of the model will be returned. Columns
        with a name starting with '_' are not provided.

        Trailing '_' are stripped away from the source name of a property.
        """
        source = {}
        for name, c in inspect(self.__class__).c.items():
            if name.startswith('_'):
                continue
            source[name.strip('_')] = getattr(self, name)
        return source

    @classmethod
    def refresh(cls):
        """Refresh the crate table to which this class is connected."""
        s = 'REFRESH TABLE "{}"'.format(cls.__tablename__)
        cls.session.execute(s)

    @classmethod
    def query(cls):
        """Do a query on the database session."""
        return cls.session.query(cls)

    @classmethod
    def search(cls, query=None):
        """Retrieve objects from database."""
        if not query:
            query = cls.session.query(cls)
        return query.all()

    @classmethod
    def count(cls, query=None):
        """Count objects matched by query."""
        if not query:
            query = cls.session.query(cls)
        query = query.statement.with_only_columns(
            [func.count()]
        ).order_by(None).offset(0).limit(1)
        return query.scalar()

    @classmethod
    def get(cls, id):
        """Get an object by ID."""
        if id is None:
            return None
        return cls.session.query(cls).get(id)

    @classmethod
    def get_list(cls, ids):
        """Return objects for IDs."""
        if ids:
            return cls.query().filter(
                cls.id.in_(ids)
            )
        # return a generator for an empty list
        return cls.query().filter(sql.false())


def execute(sql, **kwargs):
    """Execute an SQL query."""
    return DBSession.execute(sql, params=kwargs).fetchall()


def raw_crate_client():
    """Provide the raw crate client based on the SQLAlchemy bindings."""
    return Base.metadata.bind.raw_connection().connection


def genuuid():
    """Generate a random UUID4 string."""
    return str(uuid.uuid4())


@event.listens_for(DBSession, 'after_flush')
def receive_after_flush(session, flush_context):
    """listen for the 'after_flush' event

    Refresh all involved tables.
    """
    names = set([m.mapped_table.fullname
                 for m in flush_context.mappers.keys()])

    if names:
        DBSession.execute("REFRESH TABLE " + ', '.join(names))


def includeme(config):
    settings = config.get_settings()

    servers = aslist(settings.get("crate.dsn", "localhost:4200"))

    engine = create_engine(
        'crate://',
        connect_args={
            'servers': servers
        },
        echo=asbool(settings.get('crate.echo', 'False')),
        pool_size=int(settings.get('sql.pool.size', 50)),
        max_overflow=int(settings.get('sql.max.overflow', 50))
    )
    DBSession.configure(bind=engine)

    # Register zope.sqlalchemy - allow 'keep_session=True' for testing
    keep = asbool(settings.get('db.keep.session', 'False'))
    register(DBSession, keep_session=keep)

    engine.pool._use_threadlocal = True
    Base.metadata.bind = engine

    blobs.set_hosts(servers)
