import sys
import os
import django

# Assuming your script is in the 'segfault/api/authors' directory,
# and your Django project root is 'segfault'
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(project_root)

# if it doesn't work, navigate the directory containing manage.py. export the variable manually with bash
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Initialize Django
django.setup()

import requests
import json
from rest_framework import serializers
from rest_framework.exceptions import ValidationError


def transform_author_data(author):
    # Transform the author data
    author_id = author.get('id')
    author_host = "https://cmput-average-21-b54788720538.herokuapp.com/api"
    author_url = f"{author_host}/authors/{author_id}"
    author_id = author_url
    author_displayName = author.get('displayName', '')
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
    id = serializers.CharField()
    host = serializers.CharField()
    displayName = serializers.CharField()
    url = serializers.CharField()
    github = serializers.CharField()
    profileImage = serializers.CharField()

# given url, makes get request and returns the json
# TODO: get credentials from Node model instead of hardcoded
def fetch_data_from_url(url):
    creds = ("string", "string")
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
def process_author(item):
    try:
        serializer = DefaultAuthorSerializer(data=item)
        serializer.is_valid(raise_exception=True)
        return serializer.data
    except ValidationError:
        return transform_author_data(item)
    return None

#TODO: should have a model for nodes we are connecting to. iterate over the nodes and do this for every url + /authors/
#TODO: each node object should have url and credentials
def get_external_authors():
    authors = []
    external_node_url = "https://cmput-average-21-b54788720538.herokuapp.com/api/authors/"

    while external_node_url:
        data = fetch_data_from_url(external_node_url)
        if data is None:
            break
        items_key = 'results' if 'results' in data else 'items'
        for item in data.get('results', []):
            author_data = process_author(item)
            if author_data:
                authors.append(author_data)
        external_node_url = data.get('next')
    # return as a list because we want to use "+" to add to our response data we already have
    return authors

# ------ testing output
# print(get_external_authors())
# authors_data = get_external_authors()
# authors_json = json.dumps(authors_data, indent = 4)
# print(authors_json)