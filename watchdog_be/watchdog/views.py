from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST


def ping(request):
    return HttpResponse('pong')


@ensure_csrf_cookie
def set_csrf_token(request):
    return JsonResponse({'status': 'OK'})


@require_POST
def signup_account(request):
    print(request)
    return JsonResponse({'status': 'lol'})
