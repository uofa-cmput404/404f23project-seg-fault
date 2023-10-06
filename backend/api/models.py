from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Author(models.Model):
    displayName = models.CharField(max_length=255)