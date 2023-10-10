### models and serializers
from .models import Author, AuthorFollower
from .serializers import UserSerializer, AuthorSerializer
from django.contrib.auth.models import User
##### user auth
from rest_framework import generics, views, permissions, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView


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
            user_profile = Author.objects.create(
                user=user,
                displayName=username
            )
            user_profile.save()

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

