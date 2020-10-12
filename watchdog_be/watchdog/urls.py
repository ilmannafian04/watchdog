from django.urls import path

from watchdog import views

urlpatterns = [
    path('ping', views.ping),
]
