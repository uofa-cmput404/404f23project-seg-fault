import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { StoreContext } from "../../store";

const useShareViewModel = () => {
  const { state } = useContext(StoreContext);
  const userId = state.user.id;
  const authToken = state.token;

  const [followers, setFollowers] = useState([]);

  const fetchFollowers = useCallback(async () => {
    const response = await axios.get(`${userId}/followers/`, {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    });
    if (response.status === 200) {
      setFollowers(response.data);
    } else {
      console.error("Error fetching followers");
    }
  }, [userId, authToken]);

  useEffect(() => {
    fetchFollowers();
  }, [fetchFollowers]);

  const sharePost = async (post, authorId) => {
    const response = await axios.post(authorId + "/inbox/", post, {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    });
    if (response.status === 201) {
      console.log("post shared");
    } else {
      console.log(response.data);
      console.error("Error while sharing a post");
    }
  };

  return {
    followers,
    sharePost,
  };
};

export default useShareViewModel;
