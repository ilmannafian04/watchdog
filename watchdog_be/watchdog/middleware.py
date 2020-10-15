from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
from jwt import decode
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import UntypedToken

from watchdog.models import WatchDogUser
from watchdog_be.settings import SECRET_KEY


@database_sync_to_async
def get_user(user_id):
    close_old_connections()
    try:
        return WatchDogUser.objects.get(id=user_id)
    except WatchDogUser.DoesNotExist:
        return AnonymousUser()


class JWTAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope):
        return JWTAuthMiddlewareInstance(scope, self)


class JWTAuthMiddlewareInstance:
    def __init__(self, scope, middleware):
        self.middleware = middleware
        self.scope = dict(scope)
        self.inner = self.middleware.inner

    async def __call__(self, receive, send):
        try:
            token = parse_qs(self.scope['query_string'].decode('utf-8'))['token'][0]
            UntypedToken(token)
            decoded_data = decode(token, SECRET_KEY, algorithms=['HS256'])
            self.scope['user'] = await get_user(decoded_data['user_id'])
        except (InvalidToken, TokenError, KeyError):
            self.scope['user'] = AnonymousUser()
        inner = self.inner(self.scope)
        return await inner(receive, send)
