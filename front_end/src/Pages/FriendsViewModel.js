import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from './../store';

const useFriendsViewModel = () => {
  const [selectedView, setSelectedView] = useState('authors');

  const changeView = (view) => {
    setSelectedView(view);
  };

  const { state } = useContext(StoreContext);
  const userId = state.user.id;

  const [authors, setAuthors] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    fetchAuthors();
    fetchFollowers();
    fetchFollowing();
  }, []);

  const fetchAuthors = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/authors/');
    if (response.status === 200) {
      setAuthors(response.data.items);
    } else {
      console.error('Error fetching authors');
    }
  };

  const fetchFollowers = async () => {
    const parts = userId.split('/');
    const userGuid = parts[parts.length - 1];
    const response = await axios.get(`http://127.0.0.1:8000/api/authors/${userGuid}/followers/`);
    if (response.status === 200) {
      setFollowers([...response.data]);
    } else {
      console.error('Error fetching followers');
    }
  };

  const fetchFollowing = async () => {
    const parts = userId.split('/');
    const userGuid = parts[parts.length - 1];
    const response = await axios.get(`http://127.0.0.1:8000/api/authors/${userGuid}/following/`);
    if (response.status === 200) {
      setFollowing([...response.data]);
    } else {
      console.error('Error fetching following');
    }
  };

  const followAuthor = async (authorId) => {
    const response = await axios.post('http://127.0.0.1:8000/api/authors/follow/', { user_id: userId, author_id_to_follow: authorId });

    if (response.status === 200) {
      console.log('Followed');
      window.location.reload();
    } else {
      console.error('Error following author');
    }
  };

  const unfollowAuthor = async (authorId) => {
    const response = await axios.post('http://127.0.0.1:8000/api/authors/unfollow/', { user_id: userId, author_id_to_unfollow: authorId });

    if (response.status === 200) {
      window.location.reload();
    } else {
      console.error('Error unfollowing author');
    }
  };

  return {
    selectedView,
    changeView,
    authors,
    followers,
    following,
    followAuthor,
    unfollowAuthor,
  };
};

export default useFriendsViewModel;