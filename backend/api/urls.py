# from django.urls import path
# from rest_framework.routers import DefaultRouter
# from .views import PostViewSet

# post_router = DefaultRouter()
# post_router.register('posts', PostViewSet)
from django.urls import path

# from authors sub directory get the views
from .authors.AuthorViews import UserLoginView, UserRegistrationView, AuthorListView, AuthorDetailView
# from posts sub directory get the views
from .posts.PostsViews import PostListView, PostDetailView

from .views import FollowAuthorView, UnfollowAuthorView, FollowersListView, FollowingListView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('authors/', AuthorListView.as_view(), name="author-list"),
    path('authors/follow/', FollowAuthorView.as_view(), name='follow-author'),
    path('authors/unfollow/', UnfollowAuthorView.as_view(), name='unfollow-author'),
    path('authors/<str:author_id>/followers/', FollowersListView.as_view(), name="author-followers-list"),
    path('authors/<str:author_id>/following/', FollowingListView.as_view(), name="author-following-list"),
    path('authors/<str:author_id>/', AuthorDetailView.as_view(), name='author-detail'),
    ## urls for posts:
    path('authors/<str:author_id>/posts/', PostListView.as_view(), name='post-list'),
    path('authors/<str:author_id>/posts/<str:post_id>', PostDetailView.as_view(), name='post-detail'),
]
