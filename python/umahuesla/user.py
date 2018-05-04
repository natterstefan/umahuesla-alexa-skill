import graphene
from graphene import relay


class User(graphene.ObjectType):

    first_name = graphene.String(
        description="The user's first name."
    )
    last_name = graphene.String(
        description="The user's last name."
    )
    email = graphene.String(
        description="The user's contact email."
    )


class CreateUser(relay.ClientIDMutation):

    class Input:
        first_name = graphene.String(
            description="The user's first name."
        )
        last_name = graphene.String(
            description="The user's last name."
        )
        email = graphene.String(
            description="The user's email."
        )

    user = graphene.Field(
        User,
        description="The created user."
    )

    @classmethod
    def mutate_and_get_payload(cls, root, info, *args, **kwargs):
        return CreateUser(
            user=User()
        )


class Query(object):

    user = graphene.Field(
        User,
        description="Get user information."
    )

    def resolve_user(self, info):
        return User()


class Mutation(object):

    createUser = CreateUser.Field(
        description="Create a user."
    )
