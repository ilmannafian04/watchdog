from channels.routing import ProtocolTypeRouter, URLRouter

from watchdog import routing
from watchdog.middleware import JWTAuthMiddleware

application = ProtocolTypeRouter({
    'websocket': JWTAuthMiddleware(URLRouter(routing.websocket_urlpatterns))
})
