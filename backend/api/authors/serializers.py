from rest_framework import serializers
from django.contrib.auth.models import User
from ..models import Author


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')  # Include any additional fields you need

class AuthorSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField('get_id')
    class Meta:
        model = Author
        fields = ('type', 'id', 'host', 'displayName', 'url', 'github', 'profileImage')
    def get_hex(self, obj):
        # Convert the UUID to its hexadecimal representation
        author_id_hex = obj.id.hex
        return author_id_hex
    
    def get_id(self, obj):
        return obj.url
    
class AuthorDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ('displayName', 'github', 'profileImage')