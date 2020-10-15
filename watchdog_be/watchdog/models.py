import random
import string

from django.contrib.auth.models import AbstractUser
from django.db import models


class WatchDogUser(AbstractUser):
    pass


class WatchRoom(models.Model):
    owner = models.ForeignKey(WatchDogUser, models.CASCADE)
    name = models.CharField(max_length=30)
    join_code = models.CharField(max_length=5, unique=True, null=True)

    def generate_join_code(self):
        while True:
            code = ''.join(random.choice(string.ascii_uppercase) for _ in range(6))
            rooms = WatchRoom.objects.filter(join_code=code)
            if len(rooms) == 0:
                break
        self.join_code = code
        self.save()


class WatchRoomWatcher(models.Model):
    room = models.ForeignKey(WatchRoom, models.CASCADE)
    watcher = models.ForeignKey(WatchDogUser, models.CASCADE)
    color = models.CharField(max_length=7, default='#000000')
