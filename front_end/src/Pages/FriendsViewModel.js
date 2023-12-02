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
      setFollowers(response.data);
    } else {
      console.error("Error fetching followers");
    }
  }, [userId, authToken]);

  const fetchFollowing = useCallback(async () => {
    // const parts = userId.split("/");
    // const userGuid = parts[parts.length - 1];
    // const response = await axios.get(
    //   `${process.env.REACT_APP_API_URL}/authors/${userGuid}/following/`,
    //   {
    //     headers: {
    //       Authorization: `Token ${authToken}`,
    //     },
    //   }
    // );
    // if (response.status === 200) {
    //   setFollowing(response.data.items);
    // } else {
    //   console.error("Error fetching following");
    // }
    setFollowing([]);
  }, [userId, authToken]);

  useEffect(() => {
    fetchAuthors();
    fetchFollowers();
    fetchFollowing();
  }, [fetchAuthors, fetchFollowers, fetchFollowing]);

  const changeView = (view) => {
    setSelectedView(view);
  };

  const acceptFollowRequest = async (inboxItem) => {
    console.log(inboxItem);
    const payload = {
        "object": inboxItem.object
    }
    const segments = inboxItem.object.id.split('/');
    const id = segments[segments.length - 1];

    const response = await axios.put(
      `${userId}/followers/${id}/`,
      payload,
      {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      }
    );
    if (response.status === 200) {
      console.log("accepted follow request");
    } else {
      console.error("Error accepting follow request");
    }
  }

  const followAuthor = async (authorId) => {
    try {
        const actor = await axios.get(
          authorId,
          {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          }
        );
        const object = await axios.get(
          userId,
          {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          }
        );
        const payload = {
          "type": "Follow",      
          "summary":"Greg wants to follow Lara",
          "actor":actor.data,
          "object": object.data
      }
        const response_request = await axios.post(
          `${authorId}/inbox/`,
          payload,
          {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          }
        );
        console.log(response_request);

      if (response_request.status === 201) {
        console.log("sent to inbox")
        //window.location.reload();
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
    // const isFollower = followers.find(
    //   (follower) => follower.follower.id === author.id
    // );
    // const isFollowing = following.find(
    //   (follow) => follow.user.id === author.id

    // return isFollower && isFollowing;
  });

  const areFriends = (author) => {
    // const isFollower = followers.find(
    //   (follower) => follower.follower.id === author.id
    // );
    // const isFollowing = following.find(
    //   (follow) => follow.user.id === author.id
    // );

    // return isFollower && isFollowing;
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
    areFriends,
    acceptFollowRequest
  };
};

export default useFriendsViewModel;
