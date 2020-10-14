from django.urls import path

from watchdog import consumers

websocket_urlpatterns = [
    path('ws/chat/<room_code>/', consumers.ChatConsumer),
    path('ws/watch/<room_code>/', consumers.WatchPartyConsumer),
]
