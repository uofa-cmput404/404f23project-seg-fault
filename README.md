TABLE OF CONTENTS
===================================
- [CMPUT404-project-socialdistribution](#cmput404-project-socialdistribution)
- [Contributions made by team members](#contributions-made-by-team-members)
- [User Stories (checked means we have completed that user story, there are notes by the ones that are partially complete)](#user-stories--checked-means-we-have-completed-that-user-story--there-are-notes-by-the-ones-that-are-partially-complete-)
- [AJAX Docs](#ajax-docs)
    + [Home Page:](#home-page-)
    + [Inbox Page:](#inbox-page-)
    + [Social Hub:](#social-hub-)
    + [Profile:](#profile-)
    + [Login and logout:](#login-and-logout-)
- [Connecting to other teams](#connecting-to-other-teams)
    + [Team 1:](#team-1-)
      - [url:](#url-)
      - [team name:](#team-name-)
      - [connections made:](#connections-made-)
    + [Team 2:](#team-2-)
      - [url:](#url--1)
      - [team name:](#team-name--1)
      - [connections made:](#connections-made--1)
    + [Team 3:](#team-3-)
      - [url:](#url--2)
      - [team name:](#team-name--2)
      - [connections made:](#connections-made--2)
- [Contributors / Licensing](#contributors---licensing)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>


CMPUT404-project-socialdistribution
===================================

CMPUT 404 Project: Social Distribution

- [Project requirements](https://github.com/uofa-cmput404/project-socialdistribution/blob/master/project.org) 
- [Swagger API Docs](https://vibely-23b7dc4c736d.herokuapp.com/api/swagger/)
- Front end: https://656d553b4cdb7d01cfeec51c--chic-mochi-59bc3d.netlify.app/signin I would like to note that we were having CORS issues even tho we enabled CORS in our back end. To get full functionallity you will need to get the firefox extention CORS Everywhere to allow this to work. Other wise there will be issues with getting authors, we did not have time to fix this issue.

Contributions made by team members
========================

* Dennea MacCallum (dennea@ualberta.ca)
  - Worked mainly on the front end logic and UI
  - Posts UI, Post Card, like, comment, share, create post buttons as well as the comment section
  - Create a post (text, markdown, image, friend, public)
  - Update and Delete Posts
  - Home page UI
  - Sharing posts to friends
  - Friend requests
  - Connecting likes to inbox
  - Connecting friend requests to other teams
  - Connecting sending posts to inbox with other teams
  - Ajax docs
* Kingsley Okeke (nkokeke@ualberta.ca)
  - Worked mainly on the front end
  - Profile page UI and funtionality
  - Sending private posts to other users
  - Local and remote friend requests
* Kourosh Kehtari (kehtari@ualberta.ca)
    - worked on backend
    - follower and following endpoints
    - friend request endpoint
    - comment endpoint
    - test for backend
    - api documentation
    - connecting swagger
* Prabh Kooner
    - Worked on backend
    - login and signup endpoints
    - http basic and token authentication
    - author endpoints
    - post endpoints
    - comment endpoints
    - like endpoints
    - inbox endpoint, specifically post, like and comment
    - designing a solution for remote follower connectivity
    - fetching remote authors
    - deploying the django api to heroku
* Julian Gallego Franco (gallegof@ualberta.ca)
   - Front end work
   - Set up Homepage and navbar
   - Set up store and state management
   - Set up Social Hub UI and connected it to back end
   - Inbox UI
   - Friend requests UI
   - Connected likes, comments, authors, profile, signin, sing up and logout to back end
   - Github events section
   - Worked on Homepage UI
   - Promotional video

User Stories (checked means we have completed that user story, there are notes by the ones that are partially complete)
========================
- [x] As an author I want to make public posts.
- [x] As an author I want to edit public posts.
- [x] As an author, posts I create can link to images.
- [x] As an author, posts I create can be images.
- [x] As a server admin, images can be hosted on my server.
- [x] As an author, posts I create can be private to another author (NOTE: in oderder to send a private post we need to go to the other authors profile page, we did not have time to implement the profile page functionality for remote users)
- [x] As an author, posts I create can be private to my friends
- [x] As an author, I can share other author’s public posts
- [x] As an author, I can re-share other author’s friend posts to my friends
- [x] As an author, posts I make can be in simple plain text
- [x] As an author, posts I make can be in CommonMark
- [x] As an author, I want a consistent identity per server
- [x] As a server admin, I want to host multiple authors on my server
- [x] As a server admin, I want to share public images with users on other servers.
- [x] As an author, I want to pull in my github activity to my “stream”
- [x] As an author, I want to post posts to my “stream”
- [x] As an author, I want to delete my own public posts.
- [x] As an author, I want to befriend local authors
- [x] As an author, I want to befriend remote authors
- [x] As an author, I want to feel safe about sharing images and posts with my friends – images shared to friends should only be visible to friends. [public images are public]
- [x] As an author, when someone sends me a friends only-post I want to see the likes.
- [x] As an author, comments on friend posts are private only to me the original author.
- [x] As an author, I want un-befriend local and remote authors
- [x] As an author, I want to be able to use my web-browser to manage my profile
- [x] As an author, I want to be able to use my web-browser to manage/author my posts
- [x] As a server admin, I want to be able add, modify, and remove authors.
- [x] As a server admin, I want to OPTIONALLY be able allow users to sign up but require my OK to finally be on my server
- [x] As a server admin, I don’t want to do heavy setup to get the posts of my author’s friends.
- [x] As a server admin, I want a restful interface for most operations
- [x] As an author, other authors cannot modify my public post
- [x] As an author, other authors cannot modify my shared to friends post.
- [x] As an author, I want to comment on posts that I can access
- [x] As an author, I want to like posts that I can access
- [x] As an author, my server will know about my friends
- [x] As an author, When I befriend someone (they accept my friend request) I follow them, only when the other author befriends me do I count as a real friend – a bi-directional follow is a true friend.
- [x] As an author, I want to know if I have friend requests.
- [x] As an author I should be able to browse the public posts of everyone
- [ ] As a server admin, I want to be able to add nodes to share with
- [ ] As a server admin, I want to be able to remove nodes and stop sharing with them.
- [x] As a server admin, I can limit nodes connecting to me via authentication.
- [x] As a server admin, node to node connections can be authenticated with HTTP Basic Auth
- [ ] As a server admin, I can disable the node to node interfaces for connections that are not authenticated!
- [ ] As an author, I want to be able to make posts that are unlisted, that are publicly shareable by URI alone (or for embedding images)

Additional User Story Notes:  
The node interfaces are hardcoded. They can still be added or deleted quite easily. We had to write additional code for connecting to nodes that followed a different data format. We also had to continuosly update this when changes were made to their data format. All connections to our api must be token authenticated or http basic authenticated. We can't disable not authenticated connections; they are just simply not allowed. We can add valid http basic auth credentials as an admin. Only listed posts can be made but image posts can be embedded using a URI and the /image endpoint. 



AJAX Docs
========================
The following is the documentation for the ajax and api calls used on each page of our application

### Home Page:
path: `authors/<str:author_id>/posts/` methods: `GET`
- get all local public posts
- get remote public posts

### Inbox Page:
path: `authors/<str:author_id>/inbox/` methods: `PUT`, `GET`, `DELETE`
- get everything in the inbox
- delete everything in the inbox
- put likes, comments and share posts to other users inboxes
  
path: `authors/<str:author_id>/posts/<str:post_id>/likes/` methods: `GET`
- get likes for posts
  
path: `authors/<str:author_id>/posts/<str:post_id>/comments/` methods: `GET`
- get comments for posts

### Social Hub:
path: `authors/` methods: `GET`
- get all authors, including remote authors

path: `authors/<path:author_id>/followers/` methods: `GET`
- get followers

path: `authors/follow/` methods: `POST`
- follow
  
path:`authors/unfollow/` methods: `POST`
- unfollow users

path: `authors/<str:author_id>/inbox/` methods: `PUT`
- send follow request

### Profile:
path: `authors/<str:author_id>` methods: `GET`
- get author info

/github
- get github activity

path: `authors/<str:author_id>/posts/` methods: `GET`, `POST`
- get all local public posts
- get remote public posts
- create a new post

### Posts
path: `authors/<str:author_id>/inbox/` methods: `PUT`
- comments, likes and share to inbox
  
path: `authors/<str:author_id>/posts/<str:post_id>/likes/` methods: `GET`
- get likes for posts
path: `authors/<str:author_id>/posts/<str:post_id>/comments/` methods: `GET`
- get comments for posts
  
path: `authors/<str:author_id>/posts/<str:post_id>` methods: `PUT`, `DELETE`
- edit your own post
- delete your own post

### Create a Post
path: `authors/<str:author_id>/posts/` methods: `POST`
- create a new post
  
path: `authors/<str:author_id>/inbox/` methods: `PUT`
- send posts to friends inboxes
  
### Login and Signup:

path: `register/` 
- signup a new user

path: `login/`
- login the user

Error handling: we have most of our ajax in try catch in case something happens

Connecting to other teams
========================
### Team 1: 
#### url: [https://frontend-21-average-f45e3b82895c.herokuapp.com/loginPage](https://frontend-21-average-f45e3b82895c.herokuapp.com/loginPage)
- username: string
- password: string
#### team name: 21-average
#### connections made:
- Authors (we can get all authors but we get CORS errors when getting authors)
- Friend Requests (can send and recieve)
- Posts (can send and recieve)
- comments and likes (can be made and received)
#### credentials to login to the apps:

### Team 2: 
#### url: [ https://incandescent-croissant-3ddf57.netlify.app/login](https://incandescent-croissant-3ddf57.netlify.app/login)
- username: Segfault
- password: Segfault1!
#### team name: RESTless Clients
#### connections made:
- Authors (we can get all authors)
- Posts (can recieve all posts)
- Friend Requests (can send and recieve)
- Likes (gets CORS errors when liking a post)
####

### Team 3:
#### url: [https://cmput404-social-network-401e4cab2cc0.herokuapp.com/](https://cmput404-social-network-401e4cab2cc0.herokuapp.com/)
- username: local2 
- password: CMPUT404  
#### team name: team === good
#### connections made:
- Authors (we can get all authors)
- Friend Requests (can send and recieve)
- Posts (can send and recieve)
- for likes and comments this team did not implement them until the last minute so we did not have a chance to test
####

Contributors / Licensing
========================

Authors:
    
* Dennea MacCallum (dennea@ualberta.ca)
* Kingsley Okeke (nkokeke@ualberta.ca)
* Kourosh Kehtari (kehtari@ualberta.ca)
* Prabh Kooner (prabhnoo@ualberta.ca)
* Julian Gallego Franco (gallegof@ualberta.ca)

Generally everything is LICENSE'D under the MIT License.
