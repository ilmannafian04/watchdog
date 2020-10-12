from django.urls import path

from watchdog import consumers

websocket_urlpatterns = [
    path('ws/chat/<room_code>/', consumers.ChatConsumer),
]
