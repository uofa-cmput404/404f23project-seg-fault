### models and serializers
from .. models import Author, AuthorFollower, Post
from ..authors.serializers import UserSerializer, AuthorSerializer, AuthorDetailSerializer
from .serializers import PostSerializer, POST_PostSerializer
from django.contrib.auth.models import User
##### user auth
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
##### views
from rest_framework import generics, views, permissions, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
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
            return POST_PostSerializer
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
            ## need to set author, id, source, origin
            author = self.get_author()
            instance.author = author
            instance.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Post.objects.all()
#     serializer_class = PostSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_object(self):
#         post_id = self.kwargs['POST_ID']
#         author_id = self.kwargs['AUTHOR_ID']
#         return get_object_or_404(Post, id=f'http://service/authors/{author_id}/posts/{post_id}')