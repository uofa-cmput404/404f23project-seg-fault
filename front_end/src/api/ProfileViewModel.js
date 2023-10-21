import { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { StoreContext } from './../store';

const useProfileViewModel = () => {
    const { state } = useContext(StoreContext);
    const userId = state.user.id;
  
    const [profileData, setProfile] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [posts, setPosts] = useState([]);

  
    const fetchPosts = useCallback(async () => {
      try {
          const response = await axios.get(`${userId}/posts/`);
    
          if (response.status === 200) {
            const data = response.data.reverse()
            setPosts(data);
          } else {
            console.error('Error fetching posts');
          }
      } catch {
          console.log('cant fetch posts')
      }
    }, [userId]);

    const fetchFollowers = useCallback(async () => {
      try {
          const response = await axios.get(`${userId}/followers/`);
    
          if (response.status === 200) {
            const data = response.data.reverse()
            setFollowers(data);
          } else {
            console.error('Error fetching authors');
          }
      } catch {
          console.log('cant fetch posts')
      }
      }, [userId]);

    const fetchUserData = useCallback(async () => {
        try {
            const response = await axios.get(userId);
            
            if (response.status === 200) {
              setProfile(response.data);
            } else {
              console.error('Error fetching user data');
            }
        } catch {
            console.log('cant fetch data')
        }
    }, [userId]);

    const updateProfile = async() => {

    }

    useEffect(() => {
      fetchUserData();
      fetchPosts();
      fetchFollowers();
    }, [fetchPosts, fetchUserData, fetchFollowers]);

  
    return {
      posts,
      profileData,
      followers,
      fetchFollowers,
      fetchPosts,
      createPost,
      fetchUserData,
      updateProfile,
    };
  };
  
  export default useProfileViewModel;
  