import { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../store";

export function useCommentsViewModel(postId, userId, displayName) {
  const state = useContext(StoreContext);
  const authToken = state.token;

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const fetchComments = useCallback(async () => {
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
  }, [postId, authToken]);

  const dispatchCommentNotification = useCallback(async () => {
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
      console.log("Error dispatching comment notification");
    }
  }, [userId, displayName, newComment, authToken]);

  const createComment = useCallback(async () => {
    const response = await axios.post(
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
      dispatchCommentNotification();
      fetchComments();
      setNewComment("");
    } else {
      console.error("Error submitting comment");
    }
  }, [
    postId,
    newComment,
    fetchComments,
    dispatchCommentNotification,
    authToken,
  ]);

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
