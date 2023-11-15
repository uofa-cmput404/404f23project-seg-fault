### models and serializers
from ..models import Author, AuthorFollower, Post, Like, Comment, Inbox
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
from rest_framework.decorators import api_view
## from django
from django.shortcuts import get_object_or_404
from django.http import HttpResponse, HttpResponseNotFound
from datetime import datetime
from django.utils import timezone
from rest_framework import pagination
import uuid
import base64
from django.urls import resolve

#TODO: handle all types
@api_view(['POST', 'GET', 'DELETE'])
def inbox_view(request, author_id):
    # get the the author whose inbox this is
    author = Author.objects.get(id=author_id)
    if request.method == 'GET':
        try:
            author_inbox, created = Inbox.objects.get_or_create(author=author)
            return Response({"type": "inbox", "author": author.url, "items": author_inbox.items})
        except Author.DoesNotExist:
            return Response({"error": "Author not found"}, status=status.HTTP_404_NOT_FOUND)
        except Inbox.DoesNotExist:
            return Response({"error": "Inbox not found for the author"}, status=status.HTTP_404_NOT_FOUND)

    elif request.method == 'DELETE':
        try:
            author_inbox = Inbox.objects.get(author=author)
            author_inbox.clear_items()
            return Response({"message": "Inbox cleared successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Inbox.DoesNotExist:
            return Response({"error": "Inbox not found for the author"}, status=status.HTTP_404_NOT_FOUND)


    elif request.method == 'POST':
        data = request.data
        object_type = data.get('type')
        object_type = object_type.lower()
        if not object_type:
            return Response({"error": "No type provided"}, status=status.HTTP_400_BAD_REQUEST)

        # For "like" we need to store the like object and the authors on our database
        # for "follow" we also need to store the like object and the authors on our database
        if object_type not in ['post', 'comment', 'like', 'comment']:
            return Response({"message": "Type not supported"}, status=status.HTTP_400_BAD_REQUEST)


        if object_type == 'like':
            existing_like = Like.objects.filter(author=data['author'], object=data['object']).first()
    
            if not existing_like:
                # like doesn't exist so create it
                like_serializer = LikeSerializer(data=data)
                if like_serializer.is_valid():
                    like_instance = like_serializer.save()

                    # also need to send notification to inbox
                    author_inbox, created = Inbox.objects.get_or_create(author=author)
                    author_inbox.add_item(data)
                else:
                    return Response({"message": "error"}, status=status.HTTP_400_BAD_REQUEST)
                    

                return Response({"message": "Like added successfully"}, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "already liked"}, status=status.HTTP_200_OK)
        
        if object_type == 'follow':
            return Response({"message": "Type not supported"}, status=status.HTTP_400_BAD_REQUEST)
        
        # For "post" or "comment" just add the json to the inbox
        if object_type in ['post', 'comment']:
            try:
                # get the inbox or create it
                author_inbox, created = Inbox.objects.get_or_create(author=author)
                # add the post or comment to the inbox
                author_inbox.add_item(data)

            except Author.DoesNotExist:
                return Response({"error": "Author not found"}, status=status.HTTP_404_NOT_FOUND)
            except Inbox.DoesNotExist:
                return Response({"error": "Inbox not found for the author"}, status=status.HTTP_404_NOT_FOUND)

            return Response({"message": "Item added"}, status=status.HTTP_201_CREATED)

class PostLikesListView(generics.ListAPIView):
    serializer_class = LikeSerializer

    def get_queryset(self):
        post_id = self.kwargs.get('post_id') # id from url
        post_obj: Post = get_object_or_404(Post, id=post_id)
        post_url = post_obj.url
        return Like.objects.filter(object=post_url)

        
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        response_data = {"type": "likes", "items": serializer.data}
        return Response(response_data)

class CommentLikesListView(generics.ListAPIView):
    serializer_class = LikeSerializer

    def get_queryset(self):
        comment_id = self.kwargs.get('comment_id') # id from url
        comment_obj: Comment = get_object_or_404(Comment, id=comment_id)
        comment_url = comment_obj.url
        return Like.objects.filter(object=comment_url)

        
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        response_data = {"type": "likes", "items": serializer.data}
        return Response(response_data)

class LikedListView(generics.ListAPIView):
    serializer_class = LikeSerializer

    def get_queryset(self):
        author_id = self.kwargs.get('author_id')
        author_obj = get_object_or_404(Author, id=author_id)
        author_url = author_obj.url
        return Like.objects.filter(author__id=author_url)

        
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        response_data = {"type": "liked", "items": serializer.data}
        return Response(response_data)
# class InboxView(generics.RetrieveUpdateAPIView):
#     queryset = Inbox.objects.all()
#     serializer_class = InboxSerializer
#     # lookup_field = 'author__pk'

#     def retrieve(self, request, *args, **kwargs):
#         # 
#         return super().retrieve(request, *args, **kwargs)

#     # handle POST request for post, follow, comment, like
#     def update(self, request, *args, **kwargs):
#         data = request.data
#         object_type = data.get('type')
#         if not object_type:
#             return Response({"error": "No type provided"}, status=status.HTTP_400_BAD_REQUEST)

#         object_type = object_type.lower() 

#         if object_type not in ['post', 'comment']:
#             return Response({"message": "Type not supported"}, status=status.HTTP_400_BAD_REQUEST)
        
#         try:
#             author = Author.objects.get(author_id)
#             # retrieve the author's inbox
#             author_inbox = Inbox.objects.get(author=author)

#         except Author.DoesNotExist:
#             return Response({"error": "Author not found"}, status=status.HTTP_404_NOT_FOUND)
#         except Inbox.DoesNotExist:
#             return Response({"error": "Inbox not found for the author"}, status=status.HTTP_404_NOT_FOUND)

#         # add the post or comment to the inbox
#         author_inbox.add_item(data)

#         return Response({"message": "Item added to inbox successfully"}, status=status.HTTP_201_CREATED)


# class InboxView(generics.CreateAPIView):
#     def get_serializer_class(self):
#         return LikeSerializer    
#     ## get the owner of the inbox
#     def get_author(self):
#         author_id_hex = self.kwargs['author_id']
#         try:
#             author_id = uuid.UUID(hex=author_id_hex)
#             return get_object_or_404(Author, id=author_id)
#         except ValueError:
#             raise ValueError("Invalid hexadecimal author_id")
#     ## get the author's inbox    
#     def get_inbox(self):
#         try:
#             author = self.get_author()
#             return(get_object_or_404(Inbox, author=author))
#         except ValueError:
#             raise ValueError("Invalid hexadecimal author_id")

    
#     def perform_create(self, serializer):
#         validated_data = serializer.validated_data
#         type = validated_data['type']
#         type = type.lower()
#         if type == 'like':
#             author_url = validated_data['author']
#             object_url = validated_data['object']
#             if "post" in object_url:
#                 object_type = "post"
#             # the author that is doing the liking
#             author = Author.objects.get(url=author_url)
#             if object_type == 'post':
#                 post = Post.objects.get(url=object_url)
#                 like = Like.objects.create(liked_post=post, author=author, object=object_url)
#                 like.save()

#                 inbox, created = Inbox.objects.get_or_create(author=self.get_author())
#                 inbox.likes.add(like)
    
   