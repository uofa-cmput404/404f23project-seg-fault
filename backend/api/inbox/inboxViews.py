### models and serializers
from ..models import Author, AuthorFollower, Post, Like
from ..authors.serializers import UserSerializer, AuthorSerializer, AuthorDetailSerializer
from ..posts.serializers import PostSerializer
from .serializers import LikeSerializer
from django.contrib.auth.models import User
##### user auth
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
##### views
from rest_framework import generics, views, permissions, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
## from django
from django.shortcuts import get_object_or_404
from django.http import HttpResponse, HttpResponseNotFound
from datetime import datetime
from django.utils import timezone
from rest_framework import pagination
import uuid
import base64


#TODO: get the author from the user instead of the serializer
#TODO: ensures the autho id field is populated when creating a like instance
class InboxView(generics.CreateAPIView):
    serializer_class = LikeSerializer

    def get_author(self):
        author_id_hex = self.kwargs['author_id']
        try:
            author_id = uuid.UUID(hex=author_id_hex)
            return get_object_or_404(Author, id=author_id)
        except ValueError:
            raise ValueError("Invalid hexadecimal author_id")


    def create(self, request, *args, **kwargs):
        item_type = request.data.get('type', None)
        if item_type == 'Like':
            serializer = LikeSerializer(data=request.data)
            if serializer.is_valid():
                like: Like = serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
                

        else:
            return Response({'detail': 'Invalid type'}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






# class LikeCreateView(generics.CreateAPIView):
#     queryset = Like.objects.all()
#     serializer_class = LikeCreateSerializer

#     def create(self, request, *args, **kwargs):
#         # You can set the author and context based on the request data.
#         author_id = kwargs.get('AUTHOR_ID')
#         post_id = kwargs.get('POST_ID')
#         comment_id = kwargs.get('COMMENT_ID')

#         # Set the context URL based on whether it's a post or comment like.
#         if post_id:
#             context_url = f'://service/authors/{author_id}/posts/{post_id}/likes'
#         elif comment_id:
#             context_url = f'://service/authors/{author_id}/posts/{post_id}/comments/{comment_id}/likes'

#         # Create the like object
#         like_data = {
#             'context': context_url,
#             'author': author_id,
#             'liked_post': post_id,
#             'liked_comment': comment_id,
#             'summary': 'Liked a post/comment',
#             'type': 'Like',
#         }

#         serializer = self.get_serializer(data=like_data)
#         serializer.is_valid(raise_exception=True)
#         self.perform_create(serializer)

#         headers = self.get_success_headers(serializer.data)
#         return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

# class LikeRetrieveView(generics.ListAPIView):
#     serializer_class = LikeRetrieveSerializer

#     def get_queryset(self):
#         author_id = self.kwargs.get('AUTHOR_ID')
#         post_id = self.kwargs.get('POST_ID')
#         comment_id = self.kwargs.get('COMMENT_ID')

#         if post_id:
#             return Like.objects.filter(liked_post=post_id)
#         elif comment_id:
#             return Like.objects.filter(liked_comment=comment_id)
#         else:
#             return Like.objects.none()