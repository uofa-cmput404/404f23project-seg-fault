from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Author, AuthorFollower, Comment, FollowRequest

## from authors directory
from .authors.serializers import AuthorSerializer, UserSerializer
from core.settings import ROOT_URL
root_url = ROOT_URL


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
    published = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S%z", read_only=True)
    id = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ('type', 'author', 'comment', 'contentType', 'published', 'id')

    def get_type(self, obj):
        return "comment"

    def get_id(self, obj):
        return f"{root_url}/authors/{obj.author.id.hex}/posts/{obj.post.id.hex}/comments/{obj.id.hex}"

class FriendRequestSerializer(serializers.ModelSerializer):
    
    actor = AuthorSerializer(read_only=True)
    object = AuthorSerializer(read_only=True)
    type = serializers.SerializerMethodField()
    
    class Meta:
        model = FollowRequest
        fields = ('type', 'actor', 'object', 'summary')

    def get_type(self, obj):
        return "Follow"