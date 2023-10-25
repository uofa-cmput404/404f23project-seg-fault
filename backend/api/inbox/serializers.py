from rest_framework import serializers
from django.contrib.auth.models import User
from ..models import Author, User, AuthorFollower, Post, Like
from ..authors.serializers import AuthorSerializer, AuthorObjectSerializer


class LikeSerializer(serializers.ModelSerializer):
    author = AuthorObjectSerializer

    class Meta:
        model = Like
        fields = ['context', 'summary', 'type', 'author', 'object']

    def create(self, validated_data):
        object_url = validated_data.get('object_url', '')
        like = Like()

        # Determine if it's a post or a comment URL
        if 'posts' in object_url:
            # It's a post URL
            post_uuid = object_url.split('/posts/')[1].split('/')[0]
            like.liked_post = post_uuid
        elif 'comments' in object_url:
            # It's a comment URL
            comment_uuid = object_url.split('/comments/')[1].split('/')[0]
            like.liked_comment = comment_uuid

        like.save()
        return like