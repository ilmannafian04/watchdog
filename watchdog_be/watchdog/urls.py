from django.urls import path

from watchdog import views

urlpatterns = [
    path('ping', views.ping),
    path('pingbutprotected', views.ping_but_protected),
    path('account/signup', views.signup_account),
    path('watchroom', views.WatchRoomView.as_view()),
    path('watchroom/generatejoin', views.generate_join_code),
    path('watchroom/delete', views.delete_watchroom),
    path('chat', views.get_chat_history),
    path('watcher', views.customize_watcher),
]
