# from django.urls import path
# from rest_framework.routers import DefaultRouter
# from .views import PostViewSet

# post_router = DefaultRouter()
# post_router.register('posts', PostViewSet)
from django.urls import path
from . import views
from .views import UserRegistrationView, UserLoginView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('authors/', views.AuthorListView.as_view(), name="author-list")
    # Add more URLs for other authentication-related actions if needed
]
