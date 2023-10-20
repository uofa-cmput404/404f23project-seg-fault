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
    

class Post(models.Model):
    type = models.CharField(max_length=100, default="post")
    title = models.CharField(max_length=100)
    id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)
    source = models.URLField()
    origin = models.URLField()
    description = models.CharField(max_length=255)
    contentType = models.CharField(max_length=100) # markdown,plain, applicationbase64, image
    content = models.TextField()
    author = models.ForeignKey(Author, on_delete=models.CASCADE, null=True)
    # categories = models.ManyToManyField('Category', related_name='posts')
    categories = models.CharField(max_length=255, blank=True)
    count = models.PositiveIntegerField(default=0) # number of comments
    comments = models.URLField() # first page of comments
    published = models.DateTimeField(null=True)
    visibility = models.CharField(max_length=10)
    unlisted = models.BooleanField(default=False)

    def __str__(self):
        return self.title
    

class AuthorFollower(models.Model):
    user = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="followed_by")
    follower = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="following")
    created_at = models.DateTimeField(auto_now_add=True)



