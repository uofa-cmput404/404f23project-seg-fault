### models and serializers
from .. models import Author
from .serializers import UserSerializer, AuthorSerializer, AuthorDetailSerializer
from django.contrib.auth.models import User
##### user auth
from rest_framework.authentication import TokenAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
##### views
from rest_framework import generics, views, permissions, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework import pagination
from django.shortcuts import get_object_or_404
import uuid

from core.settings import ROOT_URL
root_url = ROOT_URL

#TODO: ensure unique usernames when registering
#TODO: when post request to change author, 

class UserRegistrationView(generics.CreateAPIView):
    """
    View for user registration.
    Allows new users to register by providing a username and password.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)

    def create(self, request, format=None):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            # Create a new user instance and set the password
            user = User.objects.create(username=username, is_active=False)
            user.set_password(password)
            user.save()
            
            author_serializer = AuthorSerializer()
            # create the author
            new_author = Author.objects.create(
                user=user,
                displayName=username
            )
            new_author.save()
            ## setup id, url, and host fields for this local author
            author_id = author_serializer.get_hex(new_author) # hex id
            author_url =  f"{root_url}/authors/{author_id}"
            author_host = root_url
            
            new_author.url = author_url
            new_author.host = author_host
            new_author.save()

            token, created = Token.objects.get_or_create(user=user)
            author_serializer = AuthorSerializer(new_author)

            return Response({'token': token.key, 'message': 'User registered successfully.', 'author': author_serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(generics.CreateAPIView):
    """
    View for user login.
    Authenticates a user with a username and password.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)

    def create(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = User.objects.filter(username=username).first()

        if user and user.check_password(password):
            if not user.is_active:
                return Response({'error': 'Account not activated by admin yet'}, status=status.HTTP_403_FORBIDDEN)
            # If the user exists and the password is correct, create or retrieve a token
            token, created = Token.objects.get_or_create(user=user)
            author = Author.objects.get(user=user)
            author_serializer = AuthorSerializer(author)
            return Response({'token': token.key, 'author': author_serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class AuthorPagination(pagination.PageNumberPagination):
    page_size = 5  # Number of items per page
    page_size_query_param = 'size'  # Allow clients to set the page size using a query parameter
    max_page_size = 5  # Set a maximum page size


from . import RemoteAuthors
# api/authors
#TODO: fix pagination and do the detail view
class AuthorListView(generics.ListAPIView):
    """
    View for listing all authors, including remote authors.

    Retrieves a list of local authors from the database and combines them with 
    remote authors fetched from external sources.
    """
    authentication_classes = [BasicAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    pagination_class = AuthorPagination

    def list(self, request, *args, **kwargs):
        # determine if token or basic
        auth_type = 'token' if isinstance(request.successful_authenticator, TokenAuthentication) else 'basic'
        
        authors = self.get_queryset()
        author_serializer = self.get_serializer(authors, many=True)
        remote_authors = RemoteAuthors.get_external_authors(request, auth_type)
        combined_authors =  author_serializer.data + remote_authors

        # Paginate combined authors
        if 'page' in request.query_params:
            print('paginate')
            page = self.paginate_queryset(combined_authors)
            if page is not None:
                return self.get_paginated_response({"type": "authors", "items": page})

        return Response({
            "type": "authors",
            "items": combined_authors
        }, status=status.HTTP_200_OK) 

# api/authors{author_id}
class AuthorDetailView(generics.ListCreateAPIView):
    """
    View for retrieving and updating an individual author's details.

    GET: Retrieves the details of a specific author
    POST: Updates the details of the specific author
    """
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    lookup_field = 'author_id'  # Use 'author_id' as the lookup field

    def get_serializer_class(self):
        # Use AuthorSerializer for 'list' (GET) action and AuthorDetailSerializer for 'create' (POST) action
        if self.request.method == 'POST':
            return AuthorDetailSerializer
        return AuthorSerializer

    def get_object(self):
        # Retrieve the author by converting the hexadecimal ID to UUID
        author_id_hex = self.kwargs['author_id']
        try:
            author_id = uuid.UUID(author_id_hex)
            return get_object_or_404(Author, id=author_id)
        except ValueError:
            raise ValueError("Invalid hexadecimal author_id")

    def list(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

    
    def create(self, request, *args, **kwargs):
        # This will override the default behavior of creating a new object
        # Instead, it will act like a PATCH method and update the existing object
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    