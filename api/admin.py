from django.contrib import admin
from .models import Author, Post, Comment, Like, Inbox, AuthorFollower, Node

class AuthorAdmin(admin.ModelAdmin):
    list_display = ('displayName', 'type', 'url', 'user', 'id', 'host', 'github', 'profileImage')

admin.site.register(Author, AuthorAdmin)
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Like)
admin.site.register(Inbox)
admin.site.register(AuthorFollower)
admin.site.register(Node)
