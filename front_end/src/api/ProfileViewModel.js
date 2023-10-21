import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from './../store';

const useProfileViewModel = () => {
    const { state } = useContext(StoreContext);
    const userId = state.user.id;
  
    const [profileData, setProfile] = useState([]);
    const [posts, setPosts] = useState([]);
  
    useEffect(() => {
      fetchUserData();
      fetchPosts();
    },);
  
    const fetchPosts = async () => {
    try {
        const response = await axios.get(`${userId}/posts/`);
  
        if (response.status === 200) {
          const data = response.data.reverse()
          setPosts(data);
        } else {
          console.error('Error fetching authors');
        }
    } catch {
        console.log('cant fetch posts')
    }
    };

    const fetchUserData = async () => {
        try {
            const response = await axios.get(userId);
      
            if (response.status === 200) {
              setProfile(response.data);
            } else {
              console.error('Error fetching authors');
            }
        } catch {
            console.log('cant fetch posts')
        }
    };
  
    const createPost = async (title, description, contentType, content, visibility) => {
      const body = {
        "title": title,
        "description": description,
        "contentType": contentType,
        "content": content,
        "published": null,
        "visibility": visibility,
        "unlisted": false
      }
      const response = await axios.post(`${userId}/posts/`, body);
      
      if (response.status === 200) {
        console.error('Followed');
      } else {
        console.error('Error following author');
      }
    };

    const updateProfile = async() => {

    }

  
    return {
      posts,
      profileData,
      fetchPosts,
      createPost,
      fetchUserData,
      updateProfile,
    };
  };
  
  export default useProfileViewModel;
  