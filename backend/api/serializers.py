from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Author, AuthorFollower, Comment

## from authors directory
from .authors.serializers import AuthorSerializer, UserSerializer




class FollowerListSerializer(serializers.ModelSerializer):
    follower = AuthorSerializer()
    
    class Meta:
        model = AuthorFollower
        fields = ('follower',)

class FollowingListSerializer(serializers.ModelSerializer):
    user = AuthorSerializer()
    
    class Meta:
        model = AuthorFollower
        fields = ('user',)

class CommentSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    type = serializers.SerializerMethodField()
    comment = serializers.CharField(source='content')
    published = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S%z")
    id = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ('type', 'author', 'comment', 'contentType', 'published', 'id')

    def get_type(self, obj):
        return "comment"

    def get_id(self, obj):
        root_url = "http://127.0.0.1:8000"
        return f"{root_url}/authors/{obj.author.id}/posts/{obj.post.id}/comments/{obj.id}"