from django.urls import path

# from authors sub directory get the views
from .authors.AuthorViews import UserLoginView, UserRegistrationView, AuthorListView, AuthorDetailView
# from posts sub directory get the views
from .posts.PostsViews import PostListView, PostDetailView, get_image_post
# fron inbox sub directory
from .inbox.inboxViews import InboxView

from .views import FollowAuthorView, UnfollowAuthorView, FollowersListView, FollowingListView, FollowerView, CommentListView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('authors/', AuthorListView.as_view(), name="author-list"),
    path('authors/follow/', FollowAuthorView.as_view(), name='follow-author'),
    path('authors/unfollow/', UnfollowAuthorView.as_view(), name='unfollow-author'),
    path('authors/<str:author_id>/followers/', FollowersListView.as_view(), name="author-followers-list"),
    path('authors/<str:author_id>/following/', FollowingListView.as_view(), name="author-following-list"),
    path('authors/<str:author_id>/', AuthorDetailView.as_view(), name='author-detail'),
    path('authors/<str:author_id>/followers/<str:foreign_author_id>/', FollowerView.as_view(), name='specific-follower'),
    ## urls for posts:
    path('authors/<str:author_id>/posts/', PostListView.as_view(), name='post-list'),
    path('authors/<str:author_id>/posts/<str:post_id>', PostDetailView.as_view(), name='post-detail'),
    path('authors/<str:author_id>/posts/<str:post_id>/image/', get_image_post, name='get_image_post'),
    ## comments for posts:
    path('authors/<str:author_id>/posts/<str:post_id>/comments/', CommentListView.as_view(), name='post-comments'),
    ## Inbox
    path('authors/<str:author_id>/inbox/', InboxView.as_view(), name='inbox_create'),
]
