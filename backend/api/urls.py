# from django.urls import path
# from rest_framework.routers import DefaultRouter
# from .views import PostViewSet

# post_router = DefaultRouter()
# post_router.register('posts', PostViewSet)
from django.urls import path
from . import views
from .views import UserRegistrationView, UserLoginView, FollowAuthorView, UnfollowAuthorView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('authors/', views.AuthorListView.as_view(), name="author-list"),
    path('authors/follow/', FollowAuthorView.as_view(), name='follow-author'),
    path('authors/unfollow/', UnfollowAuthorView.as_view(), name='unfollow-author'),
    path('authors/<str:author_id>/followers/', views.FollowersListView.as_view(), name="author-followers-list"),
    path('authors/<str:author_id>/following/', views.FollowingListView.as_view(), name="author-following-list"),
    # Add more URLs for other authentication-related actions if needed
]
