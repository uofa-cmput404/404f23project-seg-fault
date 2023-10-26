import { useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { StoreContext, useStore } from './../store';

const useProfileViewModel = () => {
    const { dispatch } = useStore();
    const { state } = useContext(StoreContext);
    const userId = state.user.id;
  
    const [profileData, setProfile] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
      const fetchPosts = async () => {
        try {
          const response = await axios.get(`${userId}/posts/`);
  
          if (response.status === 200) {
            const data = response.data.items.reverse();
            setPosts(data);
          } else {
            console.error('Error fetching posts');
          }
        } catch {
          console.log('cant fetch posts')
        }
      };

      const fetchFollowers = async () => {
        try {
          const response = await axios.get(`${userId}/followers/`);
  
          if (response.status === 200) {
            const data = response.data.items;
            setFollowers(data);
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
            console.error('Error fetching user data');
          }
        } catch {
          console.log('cant fetch data')
        }
      };

      fetchUserData();
      fetchFollowers();
      fetchPosts();
    }, [userId]);

    const updateProfile = async (
      {username,
      github,
      image,
      }) => {
      // Updates the profile.
      const body = {
          displayName: username,
          github,
          profileImage: image
      };

      const response = await axios.post(`${userId}/`, body);
      if (response.status === 200) {
        const user = {
          id: userId,
          username: response.data.displayName,
          profileImage: response.data.profileImage,
          github: response.data.github,
        };
        dispatch({ type: 'SET_USER', payload: user });
        setProfile(response.data);
        console.log("Profile updated");
      } else {
          console.error("Error creating profile");
      }
  };

    return {
      posts,
      profileData,
      followers,
      updateProfile
    };
  };
  
  export default useProfileViewModel;
  