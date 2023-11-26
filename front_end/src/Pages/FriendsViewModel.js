import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { StoreContext } from "../store";

const useFriendsViewModel = () => {
  const [selectedView, setSelectedView] = useState("authors");
  const { state } = useContext(StoreContext);
  const userId = state.user.id;
  const authToken = state.token;

  const [authors, setAuthors] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const fetchAuthors = useCallback(async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/authors/`,
      {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      }
    );
    if (response.status === 200) {
      setAuthors(response.data.items);
    } else {
      console.error("Error fetching authors");
    }
  }, [authToken]);

  const fetchFollowers = useCallback(async () => {
    const parts = userId.split("/");
    const userGuid = parts[parts.length - 1];
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/authors/${userGuid}/followers/`,
      {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      }
    );
    if (response.status === 200) {
      setFollowers(response.data.items);
    } else {
      console.error("Error fetching followers");
    }
  }, [userId, authToken]);

  const fetchFollowing = useCallback(async () => {
    const parts = userId.split("/");
    const userGuid = parts[parts.length - 1];
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/authors/${userGuid}/following/`,
      {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      }
    );
    if (response.status === 200) {
      setFollowing(response.data.items);
    } else {
      console.error("Error fetching following");
    }
  }, [userId, authToken]);

  useEffect(() => {
    fetchAuthors();
    fetchFollowers();
    fetchFollowing();
  }, [fetchAuthors, fetchFollowers, fetchFollowing]);

  const changeView = (view) => {
    setSelectedView(view);
  };

  const followAuthor = async (authorId) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/authors/follow/`,
      { user_id: userId, author_id_to_follow: authorId },
      {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      }
    );

    if (response.status === 200) {
      window.location.reload();
    } else {
      console.error("Error following author");
    }
  };

  const unfollowAuthor = async (authorId) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/authors/unfollow/`,
      { user_id: userId, author_id_to_unfollow: authorId },
      {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      }
    );

    if (response.status === 200) {
      window.location.reload();
    } else {
      console.error("Error unfollowing author");
    }
  };

  const filteredFriends = authors.filter((author) => {
    const isFollower = followers.find(
      (follower) => follower.follower.id === author.id
    );
    const isFollowing = following.find(
      (follow) => follow.user.id === author.id
    );

    return isFollower && isFollowing;
  });

  const filteredAuthors = authors.filter((author) => {
    const isFollowing = following.find(
      (follow) => follow.user.id === author.id
    );

    return !isFollowing;
  });

  return {
    selectedView,
    changeView,
    authors,
    followers,
    following,
    filteredFriends,
    filteredAuthors,
    followAuthor,
    unfollowAuthor,
  };
};

export default useFriendsViewModel;
