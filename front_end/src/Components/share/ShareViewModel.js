import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { StoreContext } from "../../store";

const useShareViewModel = () => {
  const { state } = useContext(StoreContext);
  const userId = state.user.id;
  const authToken = state.token;

  const [followers, setFollowers] = useState([]);

  const fetchFollowers = useCallback(async () => {
    try {
      const response = await axios.get(`${userId}/followers/`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });

      if (response.status === 200) {
        setFollowers(response.data[0].items);
      } else {
        console.error("Error fetching followers: Status code is not 200");
      }
    } catch (error) {
      console.error("Error fetching followers:", error.message);
    }
  }, [userId, authToken]);

  useEffect(() => {
    fetchFollowers();
  }, [fetchFollowers]);

  const sharePost = async (post, authorId) => {
    try {
      if (authorId.startsWith(process.env.REACT_APP_API_URL)) {
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
      } else if (authorId.startsWith(process.env.REACT_APP_TEAM_THREE_URL)) {
        const creds = "sean:admin";
        const base64Credentials = btoa(creds);
        post.visibility = post.visibility.toUpperCase();

        const response = await axios.post(`${authorId}/inbox/`, post, {
          headers: {
            Authorization: `Basic ${base64Credentials}`,
          },
        });
        if (response.status === 201) {
          console.log("post shared");
        } else {
          console.log(response.data);
          console.error("Error while sharing a post");
        }
      } else if (authorId.startsWith(process.env.REACT_APP_TEAM_ONE_URL)) {
        const creds = "vibely:string";
        const base64Credentials = btoa(creds);
        post.visibility = post.visibility.toUpperCase();
        console.log(authorId);
        const response = await axios.post(
          `${authorId}inbox/`,
          {
            items: post,
          },
          {
            headers: {
              Authorization: `Basic ${base64Credentials}`,
            },
          }
        );
        if (response.status === 201) {
          console.log("post shared");
        } else {
          console.log(response.data);
          console.error("Error while sharing a post");
        }
      } else if (authorId.startsWith(process.env.REACT_APP_TEAM_TWO_URL)) {
        const creds = "Segfault:Segfault1!";
        const base64Credentials = btoa(creds);
        post.visibility = post.visibility.toUpperCase();
        console.log(authorId);
        const response = await axios.post(`${authorId}/inbox/`, post, {
          headers: {
            Authorization: `Basic ${base64Credentials}`,
          },
        });
        if (response.status === 201) {
          console.log("post shared");
        } else {
          console.log(response.data);
          console.error("Error while sharing a post");
        }
      }
    } catch (e) {
      console.log("Error sharing post", e);
    }
  };

  return {
    followers,
    sharePost,
  };
};

export default useShareViewModel;
