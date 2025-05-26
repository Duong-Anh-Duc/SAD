from django.db import models
from django.contrib.auth.models import User

class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    ten = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    mat_khau = models.CharField(max_length=128)

    def __str__(self):
        return self.ten