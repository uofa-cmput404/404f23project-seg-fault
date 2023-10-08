from django.db import models
from django.contrib.auth.models import User
import uuid
# Create your models here.


class Author(models.Model):
    type = models.CharField(max_length=100, default="author")
    url = models.URLField(null=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)
    host = models.URLField()
    displayName = models.CharField(max_length=100, null=True)
    github = models.URLField()
    profileImage = models.URLField()

    # Add any additional fields related to your user profile here

    def __str__(self):
        return self.user.username



