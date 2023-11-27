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
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/authors/follow/`,
        { user_id: userId, author_id_to_follow: authorId },
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );
  
      // if they are not friends, send to inbox
      if(!areFriends(authorId))
      {
        if (authorId.startsWith(process.env.REACT_APP_API_URL)) {
          const response_request = await axios.post(
            `${process.env.REACT_APP_API_URL}/follow-request/`,
            { actor:{"id": getIdFromUrl(userId) }, object:{"id": getIdFromUrl(authorId)}, "summary": "baba" },
            {
              headers: {
                Authorization: `Token ${authToken}`,
              },
            }
          );
          console.log(response_request);
        }

        else if(authorId.startsWith(process.env.REACT_APP_TEAM_ONE_URL)) {
          const creds = 'vibely:string';
          const base64Credentials = btoa(creds);
          const inbox_response = await axios.post(`${authorId}/inbox/`,
          {
            items: {
              type: "Follow",      
              summary: "Hey let's be friends",
              actor: {
                type: "author",
                id: userId,
                host: process.env.REACT_APP_API_URL,
                displayName: state.username,
                url: userId,
                github: "",
                profileImage: ""
              },
              object: {
                id: authorId,
                host: null,
                displayName: "User",
                github: null,
                profileImage: null,
                first_name: "",
                last_name: "",
                email: "",
                username: "user3",
                type: "author"
              }
          }
          },
              {
                  headers: {
                      'Authorization': `Basic ${base64Credentials}`,
                  },
              }
            );
            console.log(inbox_response);
        }
      if (response.status === 200) {
        window.location.reload();
      }
    }
    catch(e) {
      console.error("Error following author");
    }
  }

  function getIdFromUrl(url) {
    // Split the URL by '/'
    const urlParts = url.split('/');

    // Get the last part of the URL
    return urlParts[urlParts.length - 1];
  }
    
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

  const areFriends = (author) => {
    const isFollower = followers.find(
      (follower) => follower.follower.id === author.id
    );
    const isFollowing = following.find(
      (follow) => follow.user.id === author.id
    );

    return isFollower && isFollowing;
  }

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
    areFriends
  };
};

export default useFriendsViewModel;
