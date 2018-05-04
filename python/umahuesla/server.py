import gevent
import logging
import os
import signal

from gevent import monkey
monkey.patch_all()  # noqa

from pyramid.authentication import AuthTktAuthenticationPolicy
from pyramid.authorization import ACLAuthorizationPolicy
from pyramid.config import Configurator
from paste.deploy.config import PrefixMiddleware

from gevent.pywsgi import WSGIServer, WSGIHandler

from .crawler import Crawler


ENV_KEY = 'UH_'

logger = logging.getLogger(__name__)


def main():
    app = start_app()
    create_server(app)


def start_app(settings={}, script=False):
    """Update settings and create the WSGI app.

    The provided settings override the default and environment settings and are
    mainly used for testing purposes.
    """
    with Configurator() as config:
        apply_environ(config)
        config.add_settings(settings)
        configure(config)
        app = config.make_wsgi_app()
        if not script:
            Crawler.spawn(gevent.sleep, 5000)

    # Apply X-Forwarded-Proto headers with the prefix middleware
    return PrefixMiddleware(app)


def create_server(app):
    """Create the main server script."""
    logger.info("Creating WSGI Server.")
    server = WSGIServer(
        ('0.0.0.0', 9090),
        app,
        handler_class=WSGIHandler,
    )
    # docker sends SIGTERM upon stop, let's gracefully shut down then
    signal.signal(signal.SIGTERM, lambda *_: server.stop(10000))
    server.serve_forever()


def apply_environ(config):
    """Apply ``UH_<key>`` environment variables to the settings."""
    key_length = len(ENV_KEY)
    settings = {}

    for k, v in os.environ.items():
        if k.startswith(ENV_KEY):
            key = k[key_length:].lower().replace("_", ".")
            settings[key] = v
    config.add_settings(settings)


def configure(config):
    """Include and scan modules for Pyramid configuration."""
    setup_logging(config)

    authn_policy = AuthTktAuthenticationPolicy(
        config.get_settings().get('auth.secret', ''),
        hashalg='sha512',
        max_age=60 * 60 * 24 * 30,
        reissue_time=60 * 60 * 24,
    )
    authz_policy = ACLAuthorizationPolicy()
    config.set_authorization_policy(authz_policy)
    config.set_authentication_policy(authn_policy)

    config.include('pyramid_tm')
    config.include('.twitter')
    config.include('.db')
    config.include('.gql')
    config.include('.file')

    config.scan()


def setup_logging(config):
    """Set up logging for the server.

    The log level can be set with the UH_LOGGING_LEVEL environment variable.
    """
    level = config.get_settings().get('logging.level', 'INFO')
    level = getattr(logging, level.upper(), 'INFO')
    logger = logging.getLogger('umahuesla')
    logger.setLevel(level)
    ch = logging.StreamHandler()
    formatter = logging.Formatter(
        '%(asctime)s %(levelname)-5.5s [%(name)s] %(message)s'
    )
    ch.setFormatter(formatter)
    logger.addHandler(ch)
