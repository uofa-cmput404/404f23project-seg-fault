### models and serializers
from ..models import Author, AuthorFollower, Post, Like, Comment, Inbox
from ..authors.serializers import UserSerializer, AuthorSerializer, AuthorDetailSerializer
from ..posts.serializers import PostSerializer
from .serializers import LikeSerializer, InboxSerializer, PostLikeSerializer
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
from django.urls import resolve



class PostLikesListView(generics.ListAPIView):
    serializer_class = PostLikeSerializer

    def get_queryset(self):
        author_id_hex = self.kwargs['author_id']
        post_id_hex = self.kwargs['post_id']
        try:
            post_id = uuid.UUID(hex=post_id_hex)
        except ValueError:
            # Handle invalid UUIDs here, such as returning an error response
            return []

        return Like.objects.filter(liked_post_id=post_id)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        likes_data = serializer.data
        
        # Create a custom response dictionary with "items" as the key
        response_data = {"type": "likes", "items": likes_data}
        
        return Response(response_data)

class InboxView(generics.CreateAPIView):
    def get_serializer_class(self):
        return LikeSerializer    
    ## get the owner of the inbox
    def get_author(self):
        author_id_hex = self.kwargs['author_id']
        try:
            author_id = uuid.UUID(hex=author_id_hex)
            return get_object_or_404(Author, id=author_id)
        except ValueError:
            raise ValueError("Invalid hexadecimal author_id")
    ## get the author's inbox    
    def get_inbox(self):
        try:
            author = self.get_author()
            return(get_object_or_404(Inbox, author=author))
        except ValueError:
            raise ValueError("Invalid hexadecimal author_id")

    
    def perform_create(self, serializer):
        validated_data = serializer.validated_data
        type = validated_data['type']
        type = type.lower()
        if type == 'like':
            author_url = validated_data['author']
            object_url = validated_data['object']
            if "post" in object_url:
                object_type = "post"
            # the author that is doing the liking
            author = Author.objects.get(url=author_url)
            if object_type == 'post':
                post = Post.objects.get(url=object_url)
                like = Like.objects.create(liked_post=post, author=author, object=object_url)
                like.save()

                inbox, created = Inbox.objects.get_or_create(author=self.get_author())
                inbox.likes.add(like)
    
    # def list(self, request, *args, **kwargs):
    #     instance = self.get_inbox()
    #     serializer = InboxSerializer(instance)
    #     return Response(serializer.data, status=status.HTTP_200_OK)

    # def get(self, request, *args, **kwargs):
    #     # Retrieve the author's inbox
    #     author = self.get_author()
    #     inbox, _ = Inbox.objects.get_or_create(author=author)

    #     # Serialize the inbox contents
    #     serializer = InboxSerializer(inbox)

    #     return Response(serializer.data)

# def get_author(self):
#         author_id_hex = self.kwargs['author_id']
#         try:
#             author_id = uuid.UUID(hex=author_id_hex)
#             return get_object_or_404(Author, id=author_id)
#         except ValueError:
#             raise ValueError("Invalid hexadecimal author_id")
# class InboxView(generics.CreateAPIView):
#     serializer_class = LikeSerializer

#     def get_author(self):
#         author_id_hex = self.kwargs['author_id']
#         try:
#             author_id = uuid.UUID(hex=author_id_hex)
#             return get_object_or_404(Author, id=author_id)
#         except ValueError:
#             raise ValueError("Invalid hexadecimal author_id")
    


#     def create(self, request, *args, **kwargs):
#         item_type = request.data.get('type', None)
#         if item_type == 'Like':
#             serializer = LikeSerializer(data=request.data)
#             if serializer.is_valid():
#                 like: Like = serializer.save()
#                 return Response(serializer.data, status=status.HTTP_201_CREATED)
                

#         else:
#             return Response({'detail': 'Invalid type'}, status=status.HTTP_400_BAD_REQUEST)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






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