import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { StoreContext } from "../store";

const useFriendsViewModel = () => {
  const [selectedView, setSelectedView] = useState("authors");
  const { state } = useContext(StoreContext);
  const userId = state.user.id;

  const [authors, setAuthors] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const fetchAuthors = useCallback(async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/authors/`
    );
    if (response.status === 200) {
      setAuthors(response.data.items);
    } else {
      console.error("Error fetching authors");
    }
  }, []);

  const fetchTeamOneRemoteAuthors = useCallback(async () => {
    const creds = 'string:string';
    const base64Credentials = btoa(creds);
    const response = await axios.get(
      `${process.env.REACT_APP_TEAM_ONE_URL}/authors/`,
      {
        headers: {
          'Authorization': `Basic ${base64Credentials}`,
        },
      }
    );

    if (response.status === 200) {
      const remoteAuthors = response.data.results.map((author) => ({
        id: `${process.env.REACT_APP_TEAM_ONE_URL}/authors/${author.id}`,
        displayName: author.username,
        profileImage: author.image,
        remote: true,
      }));
      setAuthors((authors) => [...authors, ...remoteAuthors]);
    } else {
      console.error("Error fetching team one authors.");
    }
  }, []);

  const fetchFollowers = useCallback(async () => {
    const parts = userId.split("/");
    const userGuid = parts[parts.length - 1];
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/authors/${userGuid}/followers/`
    );
    if (response.status === 200) {
      setFollowers(response.data.items);
    } else {
      console.error("Error fetching followers");
    }
  }, [userId]);

  const fetchFollowing = useCallback(async () => {
    const parts = userId.split("/");
    const userGuid = parts[parts.length - 1];
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/authors/${userGuid}/following/`
    );
    if (response.status === 200) {
      setFollowing(response.data.items);
    } else {
      console.error("Error fetching following");
    }
  }, [userId]);

  useEffect(() => {
    fetchAuthors();
    fetchTeamOneRemoteAuthors();
    fetchFollowers();
    fetchFollowing();
  }, [fetchAuthors, fetchTeamOneRemoteAuthors, fetchFollowers, fetchFollowing]);

  const changeView = (view) => {
    setSelectedView(view);
  };

  const followAuthor = async (authorId) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/authors/follow/`,
      { user_id: userId, author_id_to_follow: authorId }
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
      { user_id: userId, author_id_to_unfollow: authorId }
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
