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


class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('title', 'description', 'contentType', 'content', 'published', 'visibility', 'unlisted')
    def get_id(self, obj):
        # Convert the UUID to its hexadecimal representation
        post_id_hex = obj.id.hex
        author_url = obj.author.url
        return author_url + "/posts" + "/" + post_id_hex
    
class PostUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('title', 'description', 'contentType', 'content', 'published', 'visibility', 'unlisted')
    def get_id(self, obj):
        # Convert the UUID to its hexadecimal representation
        post_id_hex = obj.id.hex
        author_url = obj.author.url
        return author_url + "/posts" + "/" + post_id_hex
    # Set allow_blank=True for fields that can have blank values
    title = serializers.CharField(required=False)
    description = serializers.CharField(required=False)
    contentType = serializers.CharField(required=False)
    content = serializers.CharField(required=False)
    published = serializers.DateTimeField(required=False)
    visibility = serializers.CharField(required=False)
    unlisted = serializers.BooleanField(required=False)