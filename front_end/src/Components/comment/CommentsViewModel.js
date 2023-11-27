import { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../store";

export function useCommentsViewModel(postId, userId, displayName) {
  const { state } = useContext(StoreContext);
  const authToken = state.token;

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const fetchComments = useCallback(async () => {
    if (userId.startsWith(process.env.REACT_APP_API_URL)) {
      const response = await axios.get(`${postId}/comments/`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });

      if (response.status === 200) {
        setComments(response.data.comments);
      } else {
        console.error("Error fetching comments");
      }
    } else if (userId.startsWith(process.env.REACT_APP_TEAM_ONE_URL)) {
      const creds = "vibely:string";
      const base64Credentials = btoa(creds);

      const response = await axios.get(`${postId}/comments/`, {
        headers: {
          Authorization: `Basic ${base64Credentials}`,
        },
      });

      if (response.status === 200) {
        setComments(response.data.results);
      } else {
        console.error("Error fetching comments");
      }
    } else if (userId.startsWith(process.env.REACT_APP_TEAM_TWO_URL)) {
      const creds = "segfault:django100";
      const base64Credentials = btoa(creds);

      const response = await axios.get(`${postId}/comments`, {
        headers: {
          Authorization: `Basic ${base64Credentials}`,
        },
      });

      if (response.status === 200) {
        setComments(response.data.data);
      } else {
        console.error("Error fetching comments");
      }
    }
  }, [postId, userId, authToken]);

  const inboxComment = useCallback(async () => {
    if (userId.startsWith(process.env.REACT_APP_API_URL)) {
      const response = await axios.post(
        `${userId}/inbox/`,
        {
          type: "comment",
          comment: newComment,
          displayName: displayName,
        },
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );

      if (response.status === 201) {
        console.log("Comment notification dispatched");
      } else {
        console.log("Error comment to inbox");
      }
    }
  }, [userId, displayName, newComment, authToken]);

  const createComment = useCallback(async () => {
    if (userId.startsWith(process.env.REACT_APP_API_URL)) {
      const response = axios.post(
        `${postId}/comments/`,
        {
          comment: newComment,
          contentType: "comment",
        },
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );

      if (response.status === 201) {
        inboxComment();
        setNewComment("");
        fetchComments();
      } else {
        console.log("Error dispatching comment notification");
      }
    } else if (userId.startsWith(process.env.REACT_APP_TEAM_ONE_URL)) {
      // TODO: Group one is still working on inbox and comments
      const creds = "vibely:string";
      const base64Credentials = btoa(creds);

      const response = await axios.post(
        `${userId}/inbox/`,
        {
          type: "comment",
          comment: newComment,
        },
        {
          headers: {
            Authorization: `Basic ${base64Credentials}`,
          },
        }
      );

      if (response.status === 201) {
        fetchComments();
        setNewComment("");
      } else {
        console.log("Error dispatching comment notification");
      }
    } else if (userId.startsWith(process.env.REACT_APP_TEAM_TWO_URL)) {
      const creds = "segfault:django100";
      const base64Credentials = btoa(creds);

      const response = await axios.post(
        `${postId}/comments`,
        {
          comment: newComment,
          postId: postId,
          authorId: userId,
        },
        {
          headers: {
            Authorization: `Basic ${base64Credentials}`,
          },
        }
      );

      if (response.status === 201) {
        fetchComments();
        setNewComment("");
      } else {
        console.log("Error dispatching comment notification");
      }
    }
  }, [userId, postId, newComment, authToken, fetchComments, inboxComment]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return {
    comments,
    newComment,
    setNewComment,
    createComment,
  };
}
