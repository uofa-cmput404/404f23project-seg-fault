# for running the one off script
# import sys
# import os
# import django
# project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# sys.path.append(project_root)
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
# django.setup()

import requests
import json
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.request import Request



def transform_author_data(author):
    # Transform the author data
    author_id = author.get('id')
    author_host = "https://cmput-average-21-b54788720538.herokuapp.com/api"
    author_url = author_id
    author_displayName = author.get('username', '')
    author_github = author.get('github', '')
    author_profileImage = author.get('image', '')

    return {
        "type": "author",
        "id": author_id,
        "host": author_host,
        "displayName": author_displayName,
        "url": author_url,
        "github": author_github,
        "profileImage": author_profileImage
    }
# our app's default author serializer. we should first assume that authors objects we get follow the specs


class DefaultAuthorSerializer(serializers.Serializer):
    id = serializers.CharField()  # ID should always be a non-null, non-blank string
    host = serializers.CharField(allow_blank=True)
    displayName = serializers.CharField(allow_blank=True)
    url = serializers.CharField(allow_blank=True)
    github = serializers.CharField(
        allow_blank=True, allow_null=True)  # GitHub can be null
    profileImage = serializers.CharField(
        allow_blank=True, allow_null=True)  # Profile image can be null


# given url, makes get request and returns the json
# TODO: get credentials from Node model instead of hardcoded
def fetch_data_from_url(url, creds):
    try:
        response = requests.get(url, auth=creds)
        if response.status_code == 200:
            return response.json()
        else:
            print(response)
    except requests.RequestException:
        pass
    return None

# first try using our serializer (proper specs, like if we were connecting with a clone of our app it should work)
# if it doesn't work then use the custom transformation for team 1
# TODO: eventually make it so so it tries default, then team 1, then team 2 ...


def process_author(item):
    try:
        serializer = DefaultAuthorSerializer(data=item)
        serializer.is_valid(raise_exception=True)
        return serializer.data
    except ValidationError:
        return transform_author_data(item)
    return None



node_credentials = {
    "https://cmput-average-21-b54788720538.herokuapp.com/api/authors/": ("string", "string"),
    "https://silk-cmput404-project-21e5c91727a7.herokuapp.com/api/authors/": ("Segfault", "Segfault1!"),
    "https://cmput404-social-network-401e4cab2cc0.herokuapp.com/authors/": ("local2", "cmput404")
}

from ..models import Node
def get_external_authors(request, auth_type):
    # if request from remote then only get our authors (basic auth)
    if auth_type == "basic":
        return []

    # if request is from frontend then return both (token auth)
    # only fetch authors from the listed nodes
    # node_credentials = {}
    # nodes = Node.objects.all()
    # for node in nodes:
    #     node_credentials[node.url+"authors/"] = (node.username, node.password)



    all_authors = []
    for external_node_url, creds in node_credentials.items():
        authors = []
        while external_node_url:
            data = fetch_data_from_url(external_node_url, creds)
            if data is None:
                break

            items_key = 'items'
            if 'results' in data:
                items_key = 'results'
            elif 'data' in data:
                items_key = 'data'

            for item in data.get(items_key, []):
                author_data = process_author(item)
                if author_data:
                    authors.append(author_data)
            external_node_url = data.get('next')
        all_authors.extend(authors)

    return all_authors


# def is_request_from_frontend(request):
#     return request.META.get('HTTP_X_FROM_FRONTEND') == 'true'

# ------ testing output
# print(get_external_authors())
# authors_data = get_external_authors('remote')
# authors_json = json.dumps(authors_data, indent = 4)
# print(authors_json)
