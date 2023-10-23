from rest_framework import serializers
from django.contrib.auth.models import User
from ..models import Author, User, AuthorFollower, Post
from ..authors.serializers import AuthorSerializer


class PostSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField('get_id')
    categories = serializers.SerializerMethodField('get_categories')
    published = serializers.DateTimeField(format='%Y-%m-%dT%H:%M:%S%z')
    author = AuthorSerializer()
    class Meta:
        model = Post
        fields = ('type', 'title', 'id', 'source', 'origin', 'description', 'contentType', 'content', 'author', 'categories', 'count', 'comments', 'published', 'visibility', 'unlisted')
    def get_id(self, obj):
        # Convert the UUID to its hexadecimal representation
        post_id_hex = obj.id.hex
        author_url = obj.author.url
        return author_url + "/posts" + "/" + post_id_hex
    
    def get_categories(self, obj):
        # Split the categories string into a list of category names
        categories_string = obj.categories
        if categories_string:
            return categories_string.split(',')
        return []


class PostCreateSerializer(serializers.ModelSerializer):
    categories = serializers.CharField(required=False)
    class Meta:
        model = Post
        fields = ('title', 'description', 'contentType', 'content', 'categories', 'visibility', 'unlisted')
    def get_id(self, obj):
        # Convert the UUID to its hexadecimal representation
        post_id_hex = obj.id.hex
        author_url = obj.author.url
        return author_url + "/posts" + "/" + post_id_hex
    
class PostUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('title', 'description', 'contentType', 'content', 'visibility', 'unlisted')
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
    visibility = serializers.CharField(required=False)
    unlisted = serializers.BooleanField(required=False)