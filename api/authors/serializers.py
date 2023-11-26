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

#default serializer for remote connections
class DefaultAuthorSerializer(serializers.Serializer):
    id = serializers.CharField()  # ID should always be a non-null, non-blank string
    host = serializers.CharField(allow_blank=True)
    displayName = serializers.CharField(allow_blank=True)
    url = serializers.CharField(allow_blank=True)
    github = serializers.CharField(allow_blank=True, allow_null=True)  # GitHub can be null
    profileImage = serializers.CharField(allow_blank=True, allow_null=True)  # Profile image can be null