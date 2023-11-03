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

class AuthorFollower(models.Model):
    user = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="followed_by")
    follower = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="following")
    created_at = models.DateTimeField(auto_now_add=True)
    

class Post(models.Model):
    type = models.CharField(max_length=100, default="post")
    title = models.CharField(max_length=100)
    id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)
    url = models.URLField(null=True)
    source = models.URLField()
    origin = models.URLField()
    description = models.CharField(max_length=255)
    contentType = models.CharField(max_length=100) # markdown,plain, applicationbase64, image
    content = models.TextField()
    author = models.ForeignKey(Author, on_delete=models.CASCADE, null=True)
    categories = models.CharField(max_length=100)
    count = models.PositiveIntegerField(default=0) # number of comments
    comments = models.URLField(null=True)
    published = models.DateTimeField(null=True)
    visibility = models.CharField(max_length=10)
    unlisted = models.BooleanField(default=False)

    def __str__(self):
        return self.title

class Comment(models.Model):
    id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    comment = models.TextField()
    contentType = models.CharField(max_length=100, default='text/markdown')
    published = models.DateTimeField(auto_now_add=True)
    url = models.URLField(null=True)


class Like(models.Model):
    liked_post = models.ForeignKey('Post', on_delete=models.CASCADE, null=True, blank=True)
    author = models.ForeignKey(Author, on_delete=models.CASCADE, null=True)
    object = models.URLField()

from django.contrib.postgres.fields import JSONField

class Inbox(models.Model):
    author = models.OneToOneField(Author, on_delete=models.CASCADE, related_name='author_inbox')
    items = JSONField(default=list)

    def add_item(self, item_data):
        self.items.append(item_data)
        self.save()




# every author has 1 inbox
# their inbox can have multipole messages
# class Inbox(models.Model):
#     author = models.OneToOneField('Author', on_delete=models.CASCADE)
#     messages = models.ManyToManyField('Message', related_name='inbox_messages')


# class Inbox(models.Model):
#     TYPE_CHOICES = [
#         ('post', 'Post'),
#         ('like', 'Like'),
#         ('follow', 'Follow'),
#         ('comment', 'Comment'),
#     ]
#     type = models.CharField(max_length=20, choices=TYPE_CHOICES)
#     author = models.ForeignKey(Author, on_delete=models.CASCADE)
#     contentType = models.CharField(max_length=100)
#     object_id = models.PositiveIntegerField()
#     content_object = GenericForeignKey('content_type', 'object_id')
    

