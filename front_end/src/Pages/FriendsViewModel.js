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

  const [authorStatus, setAuthorStatus] = useState([
    { status: "follow", id: userId },
  ]);

  const [currentPage, setCurrentPage] = useState(1);

  const nextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, 10));
    fetchAuthors();
  };
  const previousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
    fetchAuthors();
  };

  const fetchAuthors = useCallback(async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/authors/`,
      {
        headers: {
          params: {
            page: currentPage,
          },
          Authorization: `Token ${authToken}`,
        },
      }
    );
    if (response.status === 200) {
      setAuthors(response.data.items);
    } else {
      console.error("Error fetching authors");
    }
  }, [authToken, currentPage]);

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
    console.log(response.data);
    if (response.status === 200) {
      setFollowers(response.data);
    } else {
      console.error("Error fetching followers");
    }
  }, [userId, authToken]);

  useEffect(() => {
    fetchAuthors();
    fetchFollowers();
  }, [fetchAuthors, fetchFollowers]);

  const changeView = (view) => {
    setSelectedView(view);
  };

  const acceptFollowRequest = async (inboxItem) => {
    console.log(inboxItem);
    const payload = {
      object: inboxItem.object,
    };
    const segments = inboxItem.object.id.split("/");
    const id = segments[segments.length - 1];
    try {
      await axios.put(`${userId}/followers/${id}/`, payload, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });
      followAuthor(inboxItem.object.id);
    }
    catch{
      console.error("Error accepting follow request");
    }
  };

  const followAuthor = async (authorId) => {
    try {
      const actor = await axios.get(authorId, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });
      const object = await axios.get(userId, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });
      const payload = {
        type: "Follow",
        summary: "Greg wants to follow Lara",
        actor: actor.data,
        object: object.data,
      };
      const response_request = await axios.post(`${authorId}/inbox/`, payload, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });
      console.log(response_request);

      if (response_request.status === 201) {
        console.log("Sent to inbox");
        setAuthorStatus({ status: "friend", id: authorId });
      }
    } catch (e) {
      console.error("Error following author");
    }
  };

  const unfollowAuthor = async (authorId) => {
    // Are we supposed to remove this?

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

  const filteredAuthors = authors.filter((author) => {
    const isFriend = followers.find(
      (follow) => follow.items[0].id === author.id
    );

    return !isFriend;
  });

  return {
    selectedView,
    changeView,
    followers,
    currentPage,
    nextPage,
    previousPage,
    followAuthor,
    unfollowAuthor,
    acceptFollowRequest,
    authorStatus,
    filteredAuthors,
  };
};

export default useFriendsViewModel;
