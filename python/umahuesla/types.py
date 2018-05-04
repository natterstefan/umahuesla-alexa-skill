import graphene

from datetime import datetime
from graphql.language.ast import StringValue
from pytz import UTC
from dateutil.parser import parse


class DateTime(graphene.Scalar):
    """A timestamp represented as an ISO 8601 formatted string.

    DateTime objects should contain the timezone, if left out UTC is assumed.

    Example: ``2016-11-10T23:00:00+00:00``
    """

    @staticmethod
    def serialize(dt):
        #tz_unaware = datetime.utcfromtimestamp(dt / 1000)
        tz_aware = UTC.localize(dt)
        return tz_aware.isoformat()

    @staticmethod
    def parse_literal(node):
        if isinstance(node, StringValue):
            return DateTime.parse_value(node.value)

    @staticmethod
    def parse_value(value):
        try:
            dt = parse(value)
            if dt:
                if dt.tzinfo is None:
                    dt = UTC.localize(dt)
                return dt
        except ValueError:
            return None
