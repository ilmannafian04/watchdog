from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from watchdog import models

admin.site.register(models.WatchDogUser, UserAdmin)
