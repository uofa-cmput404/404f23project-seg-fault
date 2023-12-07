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
* Kingsley Okeke (nkokeke@ualberta.ca)
  - Worked mainly on the front end
  - Profile page UI and funtionality
  - Sending private posts to other users
  - Local and remote friend requests
* Kourosh Kehtari (kehtari@ualberta.ca)
* Prabh Kooner
* Julian Gallego Franco (gallegof@ualberta.ca)

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
- [ ] As a server admin, I can limit nodes connecting to me via authentication.
- [ ] As a server admin, node to node connections can be authenticated with HTTP Basic Auth
- [ ] As a server admin, I can disable the node to node interfaces for connections that are not authenticated!
- [ ] As an author, I want to be able to make posts that are unlisted, that are publicly shareable by URI alone (or for embedding images)

AJAX Docs
========================
The following is the documentation for the ajax and api calls used on each page of our application

### Home Page:
/posts
- get all public posts
- create a new post
- edit your own post
- delete your own post
- comments, likes and share to inbox

### Inbox Page:
api/author/inbox
- get everything in the inbox
- delete everything in the inbox
  
### Social Hub:
/api/authors
- get all authors

### Profile:
/api/author endpoint
- get author info

/github
- get github activity

/posts
- get authors posts
- create a new post
- edit a post
- delete a post
- comments, likes and share to inbox

### Login and Signup:

/login endpoint 
- login the user
  
/signup endpoint
- signup a new user

Error handling:

Connecting to other teams
========================
### Team 1: 
#### url: 
#### team name: 
#### connections made:
- Authors (we can get all authors)
- Friend Requests (can send and recieve)
- Posts (can send and recieve)
#### credentials to login to the apps:
username: 
password: 

### Team 2: 
#### url: 
#### team name:
#### connections made:
- Authors (we can get all authors)
- Posts (can recieve all posts)
####
username: 
password: 

### Team 3:
#### url: [https://cmput404-social-network-401e4cab2cc0.herokuapp.com/](https://cmput404-social-network-401e4cab2cc0.herokuapp.com/)
#### team name: team === good
#### connections made:
- Authors (we can get all authors)
- Friend Requests (can send and recieve)
- Posts (can send and recieve)
####
username: 
password: 

Contributors / Licensing
========================

Authors:
    
* Dennea MacCallum (dennea@ualberta.ca)
* Kingsley Okeke (nkokeke@ualberta.ca)
* Kourosh Kehtari (kehtari@ualberta.ca)
* Prabh Kooner
* Julian Gallego Franco (gallegof@ualberta.ca)

Generally everything is LICENSE'D under the MIT License.
