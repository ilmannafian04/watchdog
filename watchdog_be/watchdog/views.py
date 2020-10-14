from django.forms import model_to_dict
from django.http import HttpResponse, JsonResponse
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
            watcher = WatchRoomWatcher(room=room, watcher=request.user)
            watcher.save()
            return Response({'room': model_to_dict(room)})
        else:
            return Response(status=400)
