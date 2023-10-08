from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Author

root_url = 'http://127.0.0.1:8000'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')  # Include any additional fields you need

class AuthorSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    host = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()
    class Meta:
        model = Author
        fields = ('type', 'id', 'host', 'displayName', 'url', 'github', 'profileImage')
    def get_id(self, obj):
        # Convert the UUID to its hexadecimal representation
        author_id_hex = obj.id.hex
        return f"{root_url}/authors/{author_id_hex}"
    def get_host(self, obj):
        return root_url
    def get_url(self, obj):
        author_id_hex = obj.id.hex
        return f"{root_url}/authors/{author_id_hex}"