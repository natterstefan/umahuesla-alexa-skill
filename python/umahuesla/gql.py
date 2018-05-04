import transaction
import graphene
import gevent

from graphene.types import resolver
from webob_graphql import serve_graphql_request
from graphql_server import default_format_error
from graphql.error import GraphQLError

from .errors import UmahueslaError
from . import user
from . import tweet


def default_resolver(attname, default_value, root, info, **args):
    """The data resolver for graphql.

    It allows to resolve dicts and objects which allow the graphene results
    to be simple dicts or instances of something providing the needed
    properties.
    If root is a dict the dict resolver is isused, otherwise the attr_resolver.
    """
    if isinstance(root, dict):
        # use indexed access to the data
        return resolver.dict_resolver(attname, default_value, root, info)
    return resolver.attr_resolver(attname, default_value, root, info)


resolver.set_default_resolver(default_resolver)


class Query(graphene.ObjectType,
            tweet.Query,
            user.Query):
    """The query definitions."""


class Mutation(graphene.ObjectType,
               user.Mutation):
    """The mutation definitions."""


SCHEMA = None


def get_schema():
    """Provides the current SCHEMA based on the Query and Mutation class.

    It looks like we need to create the schema as late as possible because of
    dynamically created types. To make sure all the dynamic types are already
    created when building the schema this method is called just before the
    first execution of a schema.
    """
    global SCHEMA
    if SCHEMA is None:
        SCHEMA = graphene.Schema(
            query=Query,
            mutation=Mutation,
        )
    return SCHEMA


class GQLContext(object):
    """The context used for graphql execution.

    The context in the graphql code is available via info.context.

    Parameters:
      registry: the global pyramid registry
    """

    def __init__(self, registry, request=None):
        self.registry = registry
        self.request = request

    def __repr__(self):
        return '<GQLContext>'


class GQLResponseBuilder(object):
    """GraphQL response builder.

    Uses the request's response as response object, so the response can be
    modified during code execution (e.g. write headers).
    """

    def __init__(self, request):
        self._request = request

    def __call__(self, body, charset, content_type, status=200, headers={}):
        response = self._request.response
        response.charset = charset
        response.content_type = content_type
        response.status = status
        response.text = body
        return response


def execute(query,
            schema=None,
            use_thread=False,
            request=None,
            commit=True,
            *args,
            **kwargs):
    """The global graphql query execution for python code."""
    if use_thread:
        result = {}

        def _run(*args, **kwargs):
            result['result'] = execute(*args, **kwargs)
        gevent.spawn(_run, query, schema, *args, **kwargs).join()
        return result.get('result', None)
    if schema is None:
        schema = get_schema()
    try:
        return schema.execute(
            query,
            context_value=GQLContext(REGISTRY, request),
            *args,
            **kwargs
        )
    except Exception:
        transaction.abort()
    finally:
        if commit:
            transaction.commit()


def graphql_view(schema_func, graphiql_enabled, require_auth=True):
    """The view code which makes graphql available to the world."""
    def view(request):
        context = GQLContext(REGISTRY, request)
        response = serve_graphql_request(
            request,
            schema_func(),
            context_value=context,
            graphiql_enabled=graphiql_enabled,
            response_class=GQLResponseBuilder(request),
            format_error=format_error,
        )
        return response
    return view


def format_error(error):
    result = default_format_error(error)
    if hasattr(error, 'original_error'):
        original = error.original_error
        if isinstance(original, UmahueslaError):
            result.update(original.buildResult())
    elif isinstance(error, GraphQLError):
        result['code'] = "GRAPHQL_ERROR"
    if not result.get('code'):
        result['code'] = "INTERNAL_ERROR"
    return result


REGISTRY = None


def includeme(config):
    global REGISTRY
    REGISTRY = config.registry
    config.add_route('graphql', '/gql')
    config.add_view(graphql_view(get_schema, False), route_name='graphql')
    config.add_route('graphql_ui', '/gqlui')
    config.add_view(graphql_view(get_schema, True), route_name='graphql_ui')
