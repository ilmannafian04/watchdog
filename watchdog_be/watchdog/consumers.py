from channels.generic.websocket import AsyncJsonWebsocketConsumer


class ChatConsumer(AsyncJsonWebsocketConsumer):
    # noinspection PyAttributeOutsideInit
    async def connect(self):
        self.room_code = self.scope['url_route']['kwargs']['room_code']
        self.room_group_name = f'chat_{self.room_code}'
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive_json(self, content, **kwargs):
        await self.channel_layer.group_send(self.room_group_name, {'type': 'chat.message', 'message': content['data']})

    async def chat_message(self, event):
        await self.send_json({'type': 'newMessage', 'data': event['message']})


class WatchPartyConsumer(AsyncJsonWebsocketConsumer):
    # noinspection PyAttributeOutsideInit
    async def connect(self):
        self.room_code = self.scope['url_route']['kwargs']['room_code']
        self.room_group_name = f'watch_{self.room_code}'
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive_json(self, content, **kwargs):
        await self.channel_layer.group_send(self.room_group_name, {'type': 'watch.player_command',
                                                                   'broadcast_sender': self.channel_name,
                                                                   'data': content['data']})

    async def watch_player_command(self, event):
        if event['broadcast_sender'] != self.channel_name:
            await self.send_json({'type': 'playerCommand', 'data': event['data']})
