import argparse
import json
import logging
import os
import transaction

from jinja2 import Template
from sqlalchemy.exc import SQLAlchemyError

from umahuesla.db import execute
from umahuesla.server import start_app


def get_sql_scripts():
    """Get all SQL scripts for database creation."""
    return (
        os.path.join(os.path.dirname(__file__), 'user.sql'),
        os.path.join(os.path.dirname(__file__), 'files.sql'),
        os.path.join(os.path.dirname(__file__), 'tweets.sql'),
    )


logger = logging.getLogger(__name__)


def main(args=None):
    parser = argparse.ArgumentParser(
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
        description='Initialize Crate DB with all necessary tables.'
    )
    parser.add_argument(
        '--options',
        default='{"crate.dsn": "localhost:4200"}',
        help="""Optional settings for Pyramid app initialization.
        Must be a stringified JSON encoded object."""
    )
    parser.add_argument(
        '--drop',
        action="store_true",
        help="Drop all tables from Crate instead of creating them"
    )

    args = parser.parse_args(args)
    options = json.loads(args.options)
    app = start_app(options, script=True)
    if args.drop:
        drop_db()
    else:
        init_db(app)


def execute_sql_files(files, params={}):
    """Create all tables based on sql files.

    Searches all *.sql files registered in SQL_SCRIPTS and executes them.

    Files are first executed as jinja templates. The output is then used as
    sql.
    """
    for filename in files:
        with open(filename, 'rb') as f:
            template = Template(str(f.read(), 'utf-8'))
            sql = template.render(params)
            for s in _parse_statements(sql.split('\n')):
                try:
                    logger.info(s)
                    execute(s)
                except SQLAlchemyError as e:
                    logger.warning(e.orig.message)


def init_db(app):
    """Init the Crate database based on a Pyramid ini file."""
    settings = app.app.registry.settings
    params = {}
    for key, value in settings.items():
        if key.startswith('crate.table.'):
            split = key.split('.')
            tablename = split[2]
            config = split[3]
            if tablename not in params:
                params[tablename] = {}
            params[tablename][config] = value

    execute_sql_files(get_sql_scripts(), params)
    transaction.commit()


def drop_db():
    """Drop all database tables.

    This should only be used for testing.
    """
    tables = execute("""
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = :schema
    """, schema='doc')
    for table_name, in tables:
        s = 'DROP TABLE IF EXISTS "{}";'.format(table_name)
        logger.info(s)
        execute(s)
    transaction.commit()


def _parse_statements(lines):
    """Return a generator of statements.

    Args: A list of strings that can contain one or more statements.
          Statements are separated using ';' at the end of a line
          Everything after the last ';' will be treated as the last statement.
    """
    lines = (l.strip() for l in lines if l)
    lines = (l for l in lines if not l.startswith('--'))
    parts = []
    for line in lines:
        parts.append(line.rstrip(';'))
        if line.endswith(';'):
            yield ' '.join(parts)
            parts[:] = []
    if parts:
        yield ' '.join(parts)
