from rest_framework import serializers
from django.contrib.auth.models import User
from ..models import Author, User, AuthorFollower, Post, Inbox, Like
from ..authors.serializers import AuthorSerializer

root_url = "http://127.0.0.1:8000/api" 



class LikeSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    
    class Meta:
        model = Like
        fields = ('context', 'summary', 'type', 'author', 'object') #don't need 'liked_post'
    def get_type(self, obj):
        return "Like"

# class GetLikeSerializer(serializers.ModelSerializer):
#     author = AuthorSerializer(read_only=True)
#     class Meta:
#         model = Like
#         fields = ('liked_post', 'author')

# class PostLikeSerializer(serializers.ModelSerializer):
#     author = AuthorSerializer(read_only=True)
#     summary = serializers.SerializerMethodField()
#     type = serializers.SerializerMethodField()
#     context = serializers.SerializerMethodField()
#     class Meta:
#         model = Like
#         fields = ('context', 'summary', 'type', 'author', 'object') #don't need 'liked_post'
#     def get_summary(self, obj):
#         author_display_name = obj.author.displayName
#         summary = f"{author_display_name} likes your post"
#         return summary
#     def get_type(self, obj):
#         return "like"
#     def get_context(self, obj):
#         return root_url

# class LikeSerializer(serializers.Serializer):
#     type = serializers.CharField()
#     author = serializers.URLField()
#     object = serializers.URLField()

# class InboxSerializer(serializers.ModelSerializer):
#     author = AuthorSerializer(read_only=True)
#     likes = GetLikeSerializer(read_only=True)
#     class Meta:
#         model = Inbox
#         fields = ('likes', 'author')

# class LikeSerializer(serializers.ModelSerializer):
#     author = AuthorObjectSerializer

#     class Meta:
#         model = Like
#         fields = ['context', 'summary', 'type', 'author', 'object']

#     def create(self, validated_data):
#         object_url = validated_data.get('object_url', '')
#         like = Like()

#         # Determine if it's a post or a comment URL
#         if 'posts' in object_url:
#             # It's a post URL
#             post_uuid = object_url.split('/posts/')[1].split('/')[0]
#             like.liked_post = post_uuid
#         elif 'comments' in object_url:
#             # It's a comment URL
#             comment_uuid = object_url.split('/comments/')[1].split('/')[0]
#             like.liked_comment = comment_uuid

#         like.save()
#         return like