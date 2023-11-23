import os
import django

# Set the environment variable for Django settings
# did it using bash

# Initialize Django
django.setup()


from rest_framework import serializers
from django.contrib.auth.models import User
from ..models import Author


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

class AuthorSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField('get_id')
    class Meta:
        model = Author
        fields = ('type', 'id', 'host', 'displayName', 'url', 'github', 'profileImage')
    def get_hex(self, obj):
        author_id_hex = obj.id.hex
        return author_id_hex
    
    def get_id(self, obj):
        return obj.url
    
class AuthorDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ('displayName', 'github', 'profileImage')
    
    displayName = serializers.CharField(required=True, allow_blank=False)
    github = serializers.URLField(required=False, allow_blank=True)
    profileImage = serializers.URLField(required=False, allow_blank=True)

class RemoteAuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ('type', 'id', 'host', 'displayName', 'url', 'github', 'profileImage')

class DefaultAuthorSerializer(serializers.Serializer):
    fields = ('type', 'id', 'host', 'displayName', 'url', 'github', 'profileImage')