from rest_framework import serializers
from django.contrib.auth.models import User
from ..models import Author, User, AuthorFollower, Post
from ..authors.serializers import AuthorSerializer


class PostSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField('get_id')
    author = AuthorSerializer()
    class Meta:
        model = Post
        fields = '__all__'
    def get_id(self, obj):
        # Convert the UUID to its hexadecimal representation
        post_id_hex = obj.id.hex
        author_url = obj.author.url
        return author_url + "/posts" + "/" + post_id_hex


class POST_PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('title', 'description', 'contentType', 'content', 'published', 'visibility', 'unlisted')
