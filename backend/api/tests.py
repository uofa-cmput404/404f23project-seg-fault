from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.test import TestCase, Client
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from .models import Author, AuthorFollower, Comment, Post, User, Comment, Inbox, Like
from .serializers import UserSerializer, AuthorSerializer, FollowingListSerializer, FollowerListSerializer, CommentSerializer

client = Client()

class BaseViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create(username="testuser")
        self.user.set_password("testpassword")
        self.user.save()
        self.author = Author.objects.create(user=self.user, displayName="testuser")
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)


class UserRegistrationViewTest(BaseViewTest):
    def test_valid_registration(self):
        data = {
            "username": "newuser",
            "password": "newpassword"
        }
        response = self.client.post(reverse('user-registration'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class UserLoginViewTest(BaseViewTest):
    def test_valid_login(self):
        data = {
            "username": "testuser",
            "password": "testpassword"
        }
        response = self.client.post(reverse('user-login'), data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_invalid_login(self):
        data = {
            "username": "wronguser",
            "password": "wrongpassword"
        }
        response = self.client.post(reverse('user-login'), data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class AuthorListViewTest(BaseViewTest):
    def test_get_authors(self):
        response = self.client.get(reverse('author-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class AuthorDetailViewTest(BaseViewTest):
    def test_get_author_detail(self):
        response = self.client.get(reverse('author-detail', kwargs={'author_id': self.author.id.hex}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_update_author_detail(self):
        data = {
            "displayName": "updatedName"
        }
        response = self.client.post(reverse('author-detail', kwargs={'author_id': self.author.id.hex}), data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.author.refresh_from_db()
        self.assertEqual(self.author.displayName, "updatedName")


class AuthorViewTests(APITestCase):
    
    def setUp(self):
        self.user1 = User.objects.create_user(username="author1", password="password123")
        self.author1 = Author.objects.create(user=self.user1, host="https://example.com", displayName="Author 1", github="https://github.com/author1", profileImage="https://example.com/img1")

        self.user2 = User.objects.create_user(username="author2", password="password123")
        self.author2 = Author.objects.create(user=self.user2, host="https://example2.com", displayName="Author 2", github="https://github.com/author2", profileImage="https://example.com/img2")

        self.post1 = Post.objects.create(
            title="Test Post",
            source="https://example.com/source",
            origin="https://example.com/origin",
            description="test post",
            contentType="plain",
            content="content",
            author=self.author1,
            categories="test",
            visibility="public"
        )

    def test_check_non_existing_follower_relationship(self):
        url = reverse('specific-follower', kwargs={'author_id': str(self.author1.id), 'foreign_author_id': str(self.author2.id)})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('is not a follower', response.data['message'])

    def test_author_can_follow_another_author(self):
        url = reverse('follow-author')
        data = {
            'user_id': str(self.author1.id),  
            'author_id_to_follow': str(self.author2.id)
        }  
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Followed successfully.')

    def test_author_can_unfollow_another_author(self):
        AuthorFollower.objects.create(user=self.author1, follower=self.author2)
        
        url = reverse('unfollow-author')
        data = {
            'user_id': str(self.author2.id),  
            'author_id_to_unfollow': str(self.author1.id)  
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Unfollowed successfully.')

    def test_can_retrieve_comment_list_for_post(self):
        url = reverse('post-comments', kwargs={'author_id': str(self.author1.id), 'post_id': str(self.post1.id)})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class TestInboxViews(TestCase):
    
    def setUp(self):
        self.user = User.objects.create(username="testuser")
        self.user.set_password("testpassword")
        self.user.save()
        self.author = Author.objects.create(user=self.user, displayName="testuser")
        self.author.url = "https://test.com/author/{}".format(self.author.id)
        self.author.save()
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.post = Post.objects.create(author=self.author, title="test title", content="test content")
        self.post.url = "https://test.com/post/{}".format(self.post.id)
        self.post.save()
    def test_get_likes_list(self):
        Like.objects.create(liked_post=self.post, author=self.author)

        response = self.client.get(reverse('post-likes', args=[str(self.author.id), str(self.post.id)]))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['items']), 1)
        
    def test_create_like_in_inbox(self):
        data = {
            'type': 'Like',
            'author': self.author.url,
            'object': self.post.url
        }

        response = self.client.post(reverse('inbox_create', args=[str(self.author.id)]), data=data)


        self.assertEqual(response.status_code, 201) 
        self.assertTrue(Inbox.objects.filter(author=self.author).exists())
        self.assertTrue(Like.objects.filter(author=self.author, liked_post=self.post).exists())


class PostListViewTest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create(username='testuser', password='12345')
        self.author = Author.objects.create(user=self.user, displayName='testuser', host='http://test.com', github='http://github.com/testuser', profileImage='http://image.com')
        self.author.url = "https://test.com/author/{}".format(self.author.id)
        self.author.save()
        self.post = Post.objects.create(title="Test Post", description="This is a test post.", contentType="text/markdown", content="Some content", author=self.author, categories="test", visibility="public")
        self.url = reverse('post-list', kwargs={'author_id': str(self.author.id)})

    def test_get_all_posts(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['items']), 1)

    def test_post_creation(self):
        data = {
            "title": "Test Post 2",
            "description": "description",
            "contentType": "text/markdown",
            "content": "content",
            "categories": "test",
            "visibility": "public"
        }
        response = self.client.post(self.url, data)
        created_post = Post.objects.get(title="Test Post 2")
        self.assertEqual(created_post.title, "Test Post 2")
        self.assertEqual(created_post.content, "content")
        self.assertEqual(created_post.description, "description")
        self.assertEqual(response.status_code, 201)


class AuthorModelTest(TestCase):
    
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.author = Author.objects.create(
            user=self.user, 
            host='http://test.com', 
            displayName='testuser', 
            github='http://github.com/testuser', 
            profileImage='http://image.com'
        )

    def test_author_creation(self):
        self.assertEqual(self.author.user.username, 'testuser')
        self.assertEqual(self.author.displayName, 'testuser')

    def test_author_str(self):
        self.assertEqual(str(self.author), 'testuser')


class PostModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.author = Author.objects.create(
            user=self.user, 
            host='http://test.com', 
            displayName='testuser', 
            github='http://github.com/testuser', 
            profileImage='http://image.com'
        )
        self.post = Post.objects.create(
            title="Test Post 3", 
            source='http://testsource3.com',
            origin='http://testorigin3.com',
            description="test post",
            contentType="text/markdown", 
            content="content",
            author=self.author,
            categories="test",
            visibility="public"
        )

    def test_post_creation(self):
        self.assertEqual(self.post.title, "Test Post 3")
        self.assertEqual(self.post.author, self.author)

    def test_post_str(self):
        self.assertEqual(str(self.post), "Test Post 3")


class CommentModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.author = Author.objects.create(
            user=self.user, 
            host='http://test.com', 
            displayName='testuser', 
            github='http://github.com/testuser', 
            profileImage='http://image.com'
        )
        self.post = Post.objects.create(
            title="Test Post 4", 
            source='http://testsource4.com',
            origin='http://testorigin4.com',
            description="test post",
            contentType="text/markdown", 
            content="content",
            author=self.author,
            categories="test",
            visibility="public"
        )
        self.comment = Comment.objects.create(
            post=self.post,
            author=self.author,
            comment="test comment"
        )

    def test_comment_creation(self):
        self.assertEqual(self.comment.comment, "test comment")
        self.assertEqual(self.comment.author, self.author)

class AuthorFollowerModelTest(TestCase):
    
    def setUp(self):
        self.user1 = User.objects.create_user(username='testuser1', password='12345')
        self.user2 = User.objects.create_user(username='testuser2', password='12345')
        self.author1 = Author.objects.create(
            user=self.user1,
            host='http://test.com',
            displayName='testuser1',
            github='http://github.com/testuser1',
            profileImage='http://image1.com'
        )
        self.author2 = Author.objects.create(
            user=self.user2,
            host='http://test.com',
            displayName='testuser2',
            github='http://github.com/testuser2',
            profileImage='http://image2.com'
        )
        self.author_follower = AuthorFollower.objects.create(
            user=self.author1,
            follower=self.author2
        )

    def test_author_follower_creation(self):
        self.assertEqual(self.author_follower.user, self.author1)
        self.assertEqual(self.author_follower.follower, self.author2)


class LikeModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.author = Author.objects.create(
            user=self.user,
            host='http://test.com',
            displayName='testuser',
            github='http://github.com/testuser',
            profileImage='http://image.com'
        )
        self.post = Post.objects.create(
            title="Test Post 5",
            source='http://testsource5.com',
            origin='http://testorigin5.com',
            description="test post",
            contentType="text/markdown",
            content="content",
            author=self.author,
            categories="test",
            visibility="public"
        )
        self.like = Like.objects.create(
            liked_post=self.post,
            author=self.author,
            object='http://object5.com'
        )

    def test_like_creation(self):
        self.assertEqual(self.like.liked_post, self.post)
        self.assertEqual(self.like.author, self.author)


class InboxModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.author = Author.objects.create(
            user=self.user,
            host='http://test.com',
            displayName='testuser',
            github='http://github.com/testuser',
            profileImage='http://image.com'
        )
        self.inbox = Inbox.objects.create(author=self.author)

    def test_inbox_creation(self):
        self.assertEqual(self.inbox.author, self.author)

    def test_add_like_to_inbox(self):
        post = Post.objects.create(
            title="Test Post 6",
            source='http://testsource6.com',
            origin='http://testorigin6.com',
            description="test post.",
            contentType="text/markdown",
            content="content",
            author=self.author,
            categories="test",
            visibility="public"
        )
        like = Like.objects.create(
            liked_post=post,
            author=self.author,
            object='http://object6.com'
        )
        self.inbox.likes.add(like)
        self.assertIn(like, self.inbox.likes.all())