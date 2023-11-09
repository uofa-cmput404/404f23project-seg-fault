import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { StoreContext } from "../../store";

const useShareViewModel = () => {
  const { state } = useContext(StoreContext);
  const userId = state.user.id;

  const [authors, setAuthors] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const fetchAuthors = useCallback(async () => {
    const response = await axios.get("http://127.0.0.1:8000/api/authors/");
    if (response.status === 200) {
      setAuthors(response.data.items);
    } else {
      console.error("Error fetching authors");
    }
  }, []);

  const fetchFollowers = useCallback(async () => {
    const parts = userId.split("/");
    const userGuid = parts[parts.length - 1];
    const response = await axios.get(
      `http://127.0.0.1:8000/api/authors/${userGuid}/followers/`
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
      `http://127.0.0.1:8000/api/authors/${userGuid}/following/`
    );
    if (response.status === 200) {
      setFollowing(response.data.items);
    } else {
      console.error("Error fetching following");
    }
  }, [userId]);

  useEffect(() => {
    fetchAuthors();
    fetchFollowers();
    fetchFollowing();
  }, [fetchAuthors, fetchFollowers, fetchFollowing]);

  const friends = authors.filter((author) => {
    let isFollower = false;
    let isFollowing = false;

    if (followers){
        isFollower = followers.find(
            (follower) => follower.follower.id === author.id
        );
    }
    if (following){
        isFollowing = following.find(
            (follow) => follow.user.id === author.id
        );
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
  }


  return {
    friends,
    sharePost
  };
};

export default useShareViewModel;
