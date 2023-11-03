from django.urls import path

# from authors sub directory get the views
from .authors.AuthorViews import UserLoginView, UserRegistrationView, AuthorListView, AuthorDetailView
# from posts sub directory get the views
from .posts.PostsViews import PostListView, PostDetailView, get_image_post
# fron inbox sub directory
from .inbox.inboxViews import inbox_view, PostLikesListView

from .views import FollowAuthorView, UnfollowAuthorView, FollowersListView, FollowingListView, FollowerView, CommentListView

from django.urls import path, re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="",
        default_version='v1',
        description="",
        terms_of_service="",
        contact=openapi.Contact(email=""),
        license=openapi.License(name=""),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)


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
    path('authors/<str:author_id>/inbox/', inbox_view.as_view(), name='inbox_post'),
    ## Likes
    # path('authors/<str:author_id>/posts/<str:post_id>/likes/', PostLikesListView.as_view(), name='post-likes'),
    ##docs
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

]
