import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from './../store';

const useFriendsViewModel = () => {
  const { state } = useContext(StoreContext);
  const userId = state.user.id;

  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/authors/');

    if (response.status === 200) {
      setAuthors(response.data.items);
    } else {
      console.error('Error fetching authors');
    }
  };

  const followAuthor = async (authorId) => {
    const response = await axios.post('http://127.0.0.1:8000/api/authors/follow/', { user_id: userId, author_id_to_follow: authorId });
    
    if (response.status === 200) {
      console.error('Followed');
    } else {
      console.error('Error following author');
    }
  };

  const unfollowAuthor = async (authorId) => {
    const response = await axios.post('http://127.0.0.1:8000/api/authors/unfollow/', { user_id: userId, author_id_to_follow: authorId });
    
    if (response.status === 200) {
      console.error('Unfollowed');
    } else {
      console.error('Error unfollowing author');
    }
  };


  return {
    authors,
    followAuthor,
    unfollowAuthor,
  };
};

export default useFriendsViewModel;
