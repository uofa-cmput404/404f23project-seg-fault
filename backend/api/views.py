from django.shortcuts import get_object_or_404
### models
from .models import Author, AuthorFollower, Comment, Post
### serializers
from .serializers import UserSerializer, AuthorSerializer, FollowingListSerializer, FollowerListSerializer, CommentSerializer
from django.contrib.auth.models import User
##### user auth
from rest_framework import generics, views, permissions, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

root_url = "http://127.0.0.1:8000/api"

class FollowAuthorView(views.APIView):
    # authentication_classes = [TokenAuthentication]
    # permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user_id = request.data.get('user_id')
        author_id_to_follow = request.data.get('author_id_to_follow')

        # Extracting the GUID from the user IDs
        user_id = user_id.rsplit('/', 1)[-1]
        author_id_to_follow = author_id_to_follow.rsplit('/', 1)[-1]

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

        # Extracting the GUID from the user IDs
        user_id = user_id.rsplit('/', 1)[-1]
        author_id_to_unfollow = author_id_to_unfollow.rsplit('/', 1)[-1]

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




import uuid
from rest_framework.pagination import PageNumberPagination
class CustomPageNumberPagination(PageNumberPagination):
    page_size = 5  # Or whatever number you want for this specific view
    def get_paginated_response(self, data):
        return Response({
            'link': self.get_next_link(),
            'previous': self.get_previous_link(),
            'page_size': self.get_page_size(self.request),  # Include page size
            'page_number': self.page.number,  # Include current page number
            'count': self.page.paginator.count,
            'comments': data  # Rename 'results' to 'my_custom_key' or whatever you prefer
        })

class CommentListView(generics.ListCreateAPIView):
    # authentication_classes = [TokenAuthentication]
    # permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        post_id_hex = self.kwargs['post_id'] # hex value for post_id
        post_id_uuid = uuid.UUID(post_id_hex) # Convert hex to UUID
        return Comment.objects.filter(post__id=post_id_uuid)

    def perform_create(self, serializer):
        post_id_hex = self.kwargs['post_id']
        post_id_uuid = uuid.UUID(post_id_hex) # Convert hex to UUID
        post = get_object_or_404(Post, id=post_id_uuid) # retrieve the post object
        post.count +=1 # increment the comment count

        author_id_hex = self.kwargs['author_id']
        author_id_uuid = uuid.UUID(author_id_hex) # Convert hex to UUID
        author = get_object_or_404(Author, id=author_id_uuid)
        comments_url = f"{root_url}/authors/{author_id_hex}/posts/{post_id_hex}/comments/"
        post.comments = comments_url
        post.save()
        
        serializer.save(post=post, author=author)