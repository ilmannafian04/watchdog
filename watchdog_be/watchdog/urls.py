from django.urls import path

from watchdog import views

urlpatterns = [
    path('ping', views.ping),
    path('setcsrf', views.set_csrf_token),
    path('account/signup', views.signup_account)
]
