import { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { StoreContext } from './../store';

const usePostsViewModel = () => {
    const { state } = useContext(StoreContext);
    const userId = state.user.id;
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true)
  
    const fetchPosts = useCallback(async () => {
    try {

        // Get all authors
        const users_response = await axios.get('http://127.0.0.1:8000/api/authors/');
        const authors = users_response.data.items
        let data = []

        if (users_response.status === 200){
            for (let author of authors.slice(1)){

                // loop through authors (skipping admin) and get all posts
                const posts_response = await axios.get(`${author.url}/posts/`);

                if (posts_response.status === 200){
                    data = data.concat(posts_response.data.items)
                } else {
                    console.error(`cant fetch posts. status code: ${posts_response.status}`);
                }
            }

            // get ids of the authers I am following
            const following_response = await axios.get(`${userId}/following/`);
            const following = following_response.data
            let followingIds = following.map(function(item) {
                return item.user.id;
              });
            
            // filter the public posts, users posts and freinds posts
            data = data.filter(function(item) {
                return item.visibility === 'public' || item.author.id === userId || (followingIds.includes(item.author.id) && item.visibility === 'friends');
            });

            //TODO: sort by published date

            setPosts(data);
            setLoading(false)
        } else {
            console.error(`cant fetch authors. status code: ${users_response.status}`);
        }


    } catch {
        console.log('Error')
    }
    },[userId]);
  
    const createPost = async (title, description, contentType, content, visibility) => {
      const body = {
        "title": title,
        "description": description,
        "contentType": contentType,
        "content": content,
        "published": null,
        "visibility": visibility,
        "unlisted": false,
        "categories": "none"
      }
      const response = await axios.post(`${userId}/posts/`, body);
      
      if (response.status === 200) {
        console.error('post created');
      } else {
        console.error('Error creating post');
      }
    };

    const deletePost = async (postId) => {
        const response = await axios.delete(postId);
        
        if (response.status === 200) {
          console.error('Deleted');
        } else {
          console.error('Error deleting post');
        }
    };

    const editPost = async (title, description, contentType, content, visibility, postId) => {
      const body = {
        "title": title,
        "description": description,
        "contentType": contentType,
        "content": content,
        "published": null,
        "visibility": visibility,
        "unlisted": false,
        "categories": "none"
      }
      const response = await axios.put(postId, body);
      
      if (response.status === 200) {
        console.error('post updated');
      } else {
        console.error('Error updating post');
      }
    };


    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

  
    return {
      loading,
      posts,
      fetchPosts,
      createPost,
      deletePost,
      editPost
    };
  };
  
  export default usePostsViewModel;
  