### models and serializers
from .. models import Author
from .serializers import UserSerializer, AuthorSerializer, AuthorDetailSerializer
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

#TODO: ensure unique usernames when registering
#TODO: when post request to change author, 

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)

    def create(self, request, format=None):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            # Create a new user instance and set the password
            user = User.objects.create(username=username)
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


            return Response({'message': 'User registered successfully.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)

    def create(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = User.objects.filter(username=username).first()

        if user and user.check_password(password):
            # If the user exists and the password is correct, create or retrieve a token
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

# get authors
class AuthorListView(generics.ListAPIView): # use ListCreateApiView if you want postings
    # authentication_classes = [TokenAuthentication]
    # permission_classes = [IsAuthenticated]
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

    # override get request
    def list(self, request, *args, **kwargs):
        # Get the list of authors and serialize them
        authors = self.get_queryset()
        author_serializer = self.get_serializer(authors, many=True)

        # Create the response dictionary
        response_data = {
            "type": "authors",
            "items": author_serializer.data
        }

        return Response(response_data, status=status.HTTP_200_OK)
    




# class AuthorDetailView(APIView):
#     def get(self, request, author_id):
#         # Use the author_id captured from the URL
#         return Response({"message": f"Author ID: {author_id}"}, status=status.HTTP_200_OK)


class AuthorDetailView(generics.ListCreateAPIView):
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
    
    