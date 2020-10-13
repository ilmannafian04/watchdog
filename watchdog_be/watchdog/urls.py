from django.urls import path

from watchdog import views

urlpatterns = [
    path('ping', views.ping),
    path('pingbutprotected', views.ping_but_protected),
    path('account/signup', views.signup_account),
]
