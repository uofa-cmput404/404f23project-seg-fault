import { useState, useEffect } from 'react';
import axios from 'axios';

const useFriendsViewModel = () => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userId = storedUser.id;

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
      console.error('Followed');
    } else {
      console.error('Error following author');
    }
  };


  return {
    authors,
    followAuthor,
    unfollowAuthor,
  };
};

export default useFriendsViewModel;
