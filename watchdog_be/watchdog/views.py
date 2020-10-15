import random
import string

import namesgenerator
from django.forms import model_to_dict
from django.http import HttpResponse, JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from watchdog.models import WatchDogUser, WatchRoom, WatchRoomWatcher


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


class WatchRoomView(APIView):
    permission_classes = [IsAuthenticated, ]

    @staticmethod
    def get(request):
        if 'id' in request.GET:
            try:
                room = WatchRoom.objects.get(id=int(request.GET['id']))
                return Response({'room': model_to_dict(room)})
            except WatchRoom.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            rooms = WatchRoom.objects.filter(owner=request.user)
            result = []
            for room in rooms:
                result.append({'id': room.id,
                               'name': room.name,
                               'memberCount': len(WatchRoomWatcher.objects.filter(room=room))})
            return Response(result)

    @staticmethod
    def post(request):
        if len(request.POST['name']) > 0:
            room = WatchRoom(name=request.POST['name'], owner=request.user)
            room.save()
            watcher = WatchRoomWatcher(room=room,
                                       watcher=request.user,
                                       color=f'#{"".join(random.choice(string.hexdigits) for _ in range(6))}',
                                       name=namesgenerator.get_random_name().replace('_', ' ').capitalize())
            watcher.save()
            result = model_to_dict(room)
            result['memberCount'] = 1
            return Response({'room': result})
        else:
            return Response(status=400)
