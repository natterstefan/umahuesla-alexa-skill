import logging

import twitter
from twitter.error import TwitterError  # noqa


log = logging.getLogger(__name__)


API_PARAMS = {
    'tweet_mode': 'extended'
}

TEMPLATES = {}

API = twitter.Api


def get(*args, **kwargs):
    api = API(**API_PARAMS)
    results = api.GetSearch(
        **kwargs
    )
    return results


def includeme(config):
    global API_PARAMS, API
    settings = config.get_settings()
    for key, value in settings.items():
        if key.startswith('twitter.api.'):
            API_PARAMS[key[12:].replace('.', '_')] = value
        elif key.startswith('twitter.template.'):
            TEMPLATES[key[17:].replace('.', '_')] = value
