from django.shortcuts import get_object_or_404
### models
from .models import Author, AuthorFollower
### serializers
from .serializers import UserSerializer, AuthorSerializer, FollowingListSerializer, FollowerListSerializer
from django.contrib.auth.models import User
##### user auth
from rest_framework import generics, views, permissions, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

root_url = "http://127.0.0.1:8000"

class FollowAuthorView(views.APIView):
    # authentication_classes = [TokenAuthentication]
    # permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user_id = request.data.get('user_id')
        author_id_to_follow = request.data.get('author_id_to_follow')

        user = get_object_or_404(Author, id=user_id)
        user_to_follow = get_object_or_404(Author, id=author_id_to_follow)

        if user != user_to_follow:
            AuthorFollower.objects.get_or_create(user=user_to_follow, follower=user)
            return Response({'message': 'Followed successfully.'}, status=status.HTTP_200_OK)

        return Response({'error': 'You cannot follow yourself.'}, status=status.HTTP_400_BAD_REQUEST)

class UnfollowAuthorView(views.APIView):
    # authentication_classes = [TokenAuthentication]
    # permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user_id = request.data.get('user_id')
        author_id_to_unfollow = request.data.get('author_id_to_unfollow')

        user = get_object_or_404(Author, id=user_id)
        user_to_unfollow = get_object_or_404(Author, id=author_id_to_unfollow)

        relationship = AuthorFollower.objects.filter(user=user_to_unfollow, follower=user)
        relationship.delete()

        return Response({'message': 'Unfollowed successfully.'}, status=status.HTTP_200_OK)

class FollowersListView(generics.ListAPIView):
    # authentication_classes = [TokenAuthentication]
    # permission_classes = [IsAuthenticated]
    serializer_class = FollowerListSerializer
    
    def get_queryset(self):
        author_id = self.kwargs['author_id']
        return AuthorFollower.objects.filter(user__id=author_id)

class FollowingListView(generics.ListAPIView):
    # authentication_classes = [TokenAuthentication]
    # permission_classes = [IsAuthenticated]
    serializer_class = FollowingListSerializer
    
    def get_queryset(self):
        author_id = self.kwargs['author_id']
        return AuthorFollower.objects.filter(follower__id=author_id)
