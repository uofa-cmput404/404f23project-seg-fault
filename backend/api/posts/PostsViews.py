### models and serializers
from .. models import Author, AuthorFollower, Post
from ..authors.serializers import UserSerializer, AuthorSerializer, AuthorDetailSerializer
from .serializers import PostSerializer, PostCreateSerializer, PostUpdateSerializer
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
from django.http import HttpResponse
import uuid

root_url = "http://127.0.0.1:8000/api"



#  ://service/authors/{AUTHOR_ID}/posts/
#TODO: ensure that content type is valid during post creation
#TODO: extract author object from token and only allow posts if token matches author_id
#TODO: set the origin and source during creation
#TODO: allow category input during creation
#TODO: need to add commentsSrc attribute to posts
class PostListView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PostCreateSerializer
        return PostSerializer

    def get_author(self):
        author_id_hex = self.kwargs['author_id']
        try:
            author_id = uuid.UUID(hex=author_id_hex)
            return get_object_or_404(Author, id=author_id)
        except ValueError:
            raise ValueError("Invalid hexadecimal author_id")

    # query posts for authors that have the given id
    def get_queryset(self):
        author = self.get_author()
        author_id_uuid = author.id
        author = get_object_or_404(Author, id=author_id_uuid)
        return Post.objects.filter(author=author)
    
    def create(self, request, *args, **kwargs):
        # Use the custom serializer for POST requests
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(data=request.data)

        if serializer.is_valid():
            instance = serializer.save()
            ## add the additional fields to the object
            ## need to set author, source, origin
            author = self.get_author()
            instance.author = author
            instance.save()

            return Response({"data": serializer.data, "id": serializer.get_id(instance)}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def head(self, request, *args, **kwargs):
        return HttpResponse(status=status.HTTP_200_OK, allow="GET, POST, HEAD, OPTIONS")

class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    lookup_field = 'post_id'
    # permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        post_id_hex = self.kwargs['post_id']
        try:
            post_id = uuid.UUID(post_id_hex)
            return get_object_or_404(Post, id=post_id)
        except ValueError:
            raise ValueError("Invalid hexadecimal post_id")

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PostCreateSerializer
        elif self.request.method == 'PUT':
            return PostUpdateSerializer
        return super().get_serializer_class()

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        # Check if the request user is the author of the post (authentication check)
        # if instance.author != self.request.user:
        #     raise PermissionDenied("You don't have permission to delete this post.")
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)