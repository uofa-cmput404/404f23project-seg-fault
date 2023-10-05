# from django.urls import path
# from rest_framework.routers import DefaultRouter
# from .views import PostViewSet

# post_router = DefaultRouter()
# post_router.register('posts', PostViewSet)


from django.urls import path
from . import views

urlpatterns = [
    path('authors/', views.AuthorListView.as_view(), name='author-list'),
]