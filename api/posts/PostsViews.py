### models and serializers
from .. models import Author, AuthorFollower, Post, Like, Comment, Inbox
from django.db.models import ObjectDoesNotExist
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
from django.http import HttpResponse, HttpResponseNotFound
from datetime import datetime
from django.utils import timezone
from rest_framework import pagination
import uuid
import base64

root_url = "http://127.0.0.1:8000/api"

class CustomPagination(pagination.PageNumberPagination):
    page_size = 5  # Number of items per page
    page_size_query_param = 'size'  # Allow clients to set the page size using a query parameter
    max_page_size = 100  # Set a maximum page size
    def paginate_queryset(self, queryset, request, view=None):
        # Check if pagination query parameters are provided
        page_param = request.query_params.get('page', None)
        size_param = request.query_params.get('size', None)
        # If pagination parameters are not provided, disable pagination
        if not page_param and not size_param:
            return None
        return super().paginate_queryset(queryset, request, view)
    def get_paginated_response(self, data):
        return Response({
            'type': 'posts',
            'items': data,
            'page': int(self.request.query_params.get('page', 1)),
            'size': int(self.request.query_params.get('size', self.page_size)),
        })


#  ://service/authors/{AUTHOR_ID}/posts/
# retrieve and creation url
class PostListView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer


    pagination_class = CustomPagination
    # permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        page = self.paginate_queryset(self.get_queryset())

        # Check if pagination query parameters are provided
        if page is not None:
            post_serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(post_serializer.data)
        else:
            queryset = self.filter_queryset(self.get_queryset())
            serializer = self.get_serializer(queryset, many=True)
            return Response({
            "type": "posts",
            "items": serializer.data
        }, status=status.HTTP_200_OK)
    

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
        queryset = Post.objects.filter(author=author).order_by('-published')
        return queryset
    
    def create(self, request, *args, **kwargs):
        # Use the custom serializer for POST requests
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(data=request.data)

        if serializer.is_valid():
            instance: Post = serializer.save() # explictly tells type Post
            instance = serializer.save()
            author = self.get_author()
            instance.author = author

            # true origin is our node for local posts
            instance.origin = serializer.get_id(instance)
            instance.source = serializer.get_id(instance)
            instance.url = serializer.get_id(instance)
            instance.published = timezone.now()


            instance.save()

            # send public posts to all inboxed
            if (instance.visibility.lower() == 'public'):
                # Iterate over all local authors
                for author in Author.objects.all():
                    # Check if the author already has an inbox if not create it
                    try:
                        inbox = author.author_inbox
                    except ObjectDoesNotExist:
                        # If not, create one
                        inbox = Inbox.objects.create(author=author)

                    item_data = PostSerializer(instance).data
                    # Now add the item to the inbox
                    inbox.add_item(item_data)

                # do it for external authors
                # i think the function isn't using request paramter so remove it
                # put auth=token to bypass the check. so it doesn't return empty
                # call get_external_authors(request, 'token')
                # convert it to json. for each author send a post request to the inbox url
            
            # if == 'friends'
            # get this author, get the people who follow this author
            # go through the authors and create the inbox if not already and put it in theri inbox
            # there might be people who follow you that are remote (send post request)

            

            return Response({"data": serializer.data, "id": serializer.get_id(instance)}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def head(self, request, *args, **kwargs):
        return HttpResponse(status=status.HTTP_200_OK, allow="GET, POST, HEAD, OPTIONS")







#URL: ://service/authors/{AUTHOR_ID}/posts/{POST_ID}
# get, post, put, delete
class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    lookup_field = 'post_id'

    def get_object(self):
        post_id_hex = self.kwargs['post_id']
        try:
            post_id = uuid.UUID(post_id_hex)
            return get_object_or_404(Post, id=post_id)
        except ValueError:
            raise ValueError("Invalid hexadecimal post_id")

    def get_serializer_class(self):
        if self.request.method == 'PUT':
            return PostCreateSerializer
        elif self.request.method == 'POST':
            return PostUpdateSerializer
        return super().get_serializer_class()

    # updating
    def post(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # creation
    def put(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)

        if serializer.is_valid():
            instance = serializer.save()
            instance.published = timezone.now()  # Set the published field on the instance
            instance.save()  # Save the modified instance
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        # Check if the request user is the author of the post (authentication check)
        # if instance.author != self.request.user:
        #     raise PermissionDenied("You don't have permission to delete this post.")

        # we also need to delete the associated like object
        Like.objects.filter(object=instance.url).delete()
        # we also need to delete all comments

        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    




def get_image_post(request, author_id, post_id):
    try:
        # Convert the post_id string to a UUID
        post_id = uuid.UUID(post_id)
        post = Post.objects.get(id=post_id)
    except (ValueError, Post.DoesNotExist):
        return HttpResponseNotFound('Image post not found')

    # check if image post
    if not post.contentType.startswith('image/'):
        return HttpResponseNotFound('Not an image post')

    # Extract the base64-encoded image data
    image_data = post.content.split(';base64,', 1)[-1]

    # Decode the base64 image data
    try:
        image_bytes = base64.b64decode(image_data)
    except Exception as e:
        return HttpResponseNotFound('Error decoding image data')

    # Determine the content type (e.g., "image/png", "image/jpeg") from the contentType field
    content_type = post.contentType

    # Return the image data as an HTTP response
    response = HttpResponse(image_bytes, content_type=content_type)  # Set the content type based on the post's contentType

    return response