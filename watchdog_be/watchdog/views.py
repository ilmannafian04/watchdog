from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from watchdog.models import WatchDogUser


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
