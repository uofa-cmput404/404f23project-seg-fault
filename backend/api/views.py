from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
# from django.views import generic
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
#####################################
from django.shortcuts import render
from rest_framework import generics
from .models import Author
from .serializers import AuthorSerializer

# Create your views here.



# get authors
class AuthorListView(generics.ListAPIView): # use ListCreateApiView if you want postings
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

