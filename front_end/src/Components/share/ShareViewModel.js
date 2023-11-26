import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { StoreContext } from "../../store";

const useShareViewModel = () => {
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

  const friends = authors.filter((author) => {
    let isFollower = false;
    let isFollowing = false;

    if (followers) {
      isFollower = followers.find(
        (follower) => follower.follower.id === author.id
      );
    }
    if (following) {
      isFollowing = following.find((follow) => follow.user.id === author.id);
    }
    return isFollower && isFollowing;
  });

  const sharePost = async (post, authorId) => {
    const response = await axios.post(authorId + "/inbox/", post);
    if (response.status === 201) {
      setFollowing(response.data.items);
    } else {
      console.log(response.data);
      console.error("Error while sharing a post");
    }
  };

  return {
    friends,
    sharePost,
  };
};

export default useShareViewModel;
