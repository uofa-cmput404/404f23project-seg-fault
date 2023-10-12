from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Author, AuthorFollower

## from authors directory
from .authors.serializers import AuthorSerializer, UserSerializer




class FollowingSerializer(serializers.ModelSerializer):
    user = AuthorSerializer()
    class Meta:
        model = AuthorFollower
        fields = ('user')