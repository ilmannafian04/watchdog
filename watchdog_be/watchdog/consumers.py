from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from watchdog.models import WatchRoomWatcher, WatchRoom


# noinspection PyAttributeOutsideInit
class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        if not self.scope['user'].is_authenticated:
            await self.close()
            return
        self.room_code = self.scope['url_route']['kwargs']['room_code']
        self.room_group_name = f'chat_{self.room_code}'
        await self.set_chat_name_color()
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive_json(self, content, **kwargs):
        await self.channel_layer.group_send(self.room_group_name, {'type': 'chat.message',
                                                                   'data': {'message': content['data'],
                                                                            'name': self.chat_name,
                                                                            'color': self.color}})

    async def chat_message(self, event):
        await self.send_json({'type': 'newMessage', 'data': event['data']})

    @database_sync_to_async
    def set_chat_name_color(self):
        room = WatchRoom.objects.get(id=self.room_code)
        relation = WatchRoomWatcher.objects.get(room=room, watcher=self.scope['user'])
        self.color = relation.color
        self.chat_name = relation.name


class WatchPartyConsumer(AsyncJsonWebsocketConsumer):
    # noinspection PyAttributeOutsideInit
    async def connect(self):
        if not self.scope['user'].is_authenticated:
            await self.close()
            return
        self.room_code = self.scope['url_route']['kwargs']['room_code']
        self.room_group_name = f'watch_{self.room_code}'
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive_json(self, content, **kwargs):
        handler_type = ''
        if content['type'] == 'playerCommand':
            await self.channel_layer.group_send(self.room_group_name, {'type': 'watch.player_command',
                                                                       'broadcast_sender': self.channel_name,
                                                                       'data': content['data']})
        elif content['type'] == 'changeVideo':
            await self.set_video_in_model(content['data'])
            handler_type = 'watch.change_video'
        elif content['type'] == 'seekPlayer':
            handler_type = 'watch.seek_player'
        if handler_type != '':
            await self.channel_layer.group_send(self.room_group_name, {'type': handler_type,
                                                                       'data': content['data']})

    async def watch_player_command(self, event):
        if event['broadcast_sender'] != self.channel_name:
            await self.send_json({'type': 'playerCommand', 'data': event['data']})

    async def watch_change_video(self, event):
        await self.send_json({'type': 'changeVideo', 'data': event['data']})

    async def watch_seek_player(self, event):
        await self.send_json({'type': 'seekPlayer', 'data': event['data']})

    @database_sync_to_async
    def set_video_in_model(self, url):
        room = WatchRoom.objects.get(id=self.room_code)
        room.current_video = url
        room.save()
