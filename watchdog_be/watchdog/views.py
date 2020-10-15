import random
import re
import string

import namesgenerator
from django.http import HttpResponse, JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from watchdog.models import WatchDogUser, WatchRoom, WatchRoomWatcher, ChatMessage


@api_view(['GET'])
def ping(request):
    return HttpResponse('pong')


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ping_but_protected(request):
    return HttpResponse('protected pong')


@api_view(['POST'])
def signup_account(request):
    new_user = WatchDogUser.objects.create_user(request.POST['username'],
                                                password=request.POST['password'],
                                                email=request.POST['email'])
    new_user.save()
    return JsonResponse({'status': 'OK'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_join_code(request):
    try:
        room = WatchRoom.objects.get(id=request.POST['id'])
        room.generate_join_code()
        return Response({'code': room.join_code})
    except (KeyError, WatchRoom.DoesNotExist):
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_history(request):
    if 'id' in request.GET:
        try:
            room = WatchRoom(id=request.GET['id'])
        except WatchRoom.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        chat_history = ChatMessage.objects.filter(room=room)[:100]
        result = []
        for chat in chat_history:
            result.append({'message': chat.message,
                           'name': chat.relation.name,
                           'color': chat.relation.color})
        return Response(result)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_watchroom(request):
    if 'id' in request.POST:
        try:
            room = WatchRoom.objects.get(id=request.POST['id'])
        except WatchRoom.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        room.delete()
        return Response({'id': request.POST['id']})
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def customize_watcher(request):
    if 'id' in request.POST:
        try:
            room = WatchRoom.objects.get(id=request.POST['id'])
        except WatchRoom.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        watcher = WatchRoomWatcher.objects.get(watcher=request.user, room=room)
        if 'name' in request.POST:
            if len(request.POST['name']) == 0 and len(request.POST['name']) > 20:
                return Response(status.HTTP_400_BAD_REQUEST)
            watcher.name = request.POST['name']
        elif 'color' in request.POST:
            match = re.search(request.POST['color'], '^#(?:[0-9a-fA-F]{3}){1,2}$')
            if len(request.POST['color']) != 7 and not match:
                return Response(status.HTTP_400_BAD_REQUEST)
            watcher.color = request.POST['color']
        watcher.save()
        return Response({'status': 'OK'})
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)


class WatchRoomView(APIView):
    permission_classes = [IsAuthenticated, ]

    @staticmethod
    def get(request):
        if 'id' in request.GET:
            try:
                room = WatchRoom.objects.get(id=int(request.GET['id']))
                return Response({'room': {'id': room.id,
                                          'currentVideo': room.current_video,
                                          'joinCode': room.join_code,
                                          'owner': request.user.id == room.owner.id,
                                          'name': room.name,
                                          'memberCount': len(WatchRoomWatcher.objects.filter(room=room))}})
            except WatchRoom.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            watchers = WatchRoomWatcher.objects.filter(watcher=request.user)
            result = []
            for watcher in watchers:
                result.append({'id': watcher.room.id,
                               'currentVideo': watcher.room.current_video,
                               'joinCode': watcher.room.join_code,
                               'owner': request.user.id == watcher.room.owner.id,
                               'name': watcher.room.name,
                               'memberCount': len(WatchRoomWatcher.objects.filter(room=watcher.room))})
            return Response(result)

    @staticmethod
    def post(request):
        if 'name' in request.POST or 'code' in request.POST:
            if 'name' in request.POST:
                room = WatchRoom(name=request.POST['name'], owner=request.user)
                room.save()
            else:
                try:
                    room = WatchRoom.objects.get(join_code=request.POST['code'])
                    watcher = WatchRoomWatcher.objects.filter(room=room, watcher=request.user)
                    if len(watcher) > 0:
                        return Response({'status': 'Already Joined'})
                except (WatchRoom.DoesNotExist, KeyError):
                    return Response(status=status.HTTP_404_NOT_FOUND)
            relation = WatchRoomWatcher(room=room,
                                        watcher=request.user,
                                        color=f'#{"".join(random.choice(string.hexdigits) for _ in range(6))}',
                                        name=namesgenerator.get_random_name().replace('_', ' ').capitalize())
            relation.save()
            return Response({'room': {'id': room.id,
                                      'currentVideo': room.current_video,
                                      'joinCode': room.join_code,
                                      'owner': request.user.id == room.owner.id,
                                      'name': room.name,
                                      'memberCount': len(WatchRoomWatcher.objects.filter(room=room))}})
