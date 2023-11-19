import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export function useCommentsViewModel(postId, userId, displayName, type) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const fetchComments = useCallback(async () => {
    const response = await axios.get(`${postId}/comments/`);

    if (response.status === 200) {
      if (type === "local") {
        setComments(response.data.comments);
      } else if (type === "remoteGroup1") {
        setComments(response.data.results);
      }
    } else {
      console.error("Error fetching comments");
    }
  }, [postId, type]);

  const dispatchCommentNotification = useCallback(async () => {
    const response = await axios.post(`${userId}/inbox/`, {
      type: "comment",
      comment: newComment,
      displayName: displayName,
    });

    if (response.status === 201) {
      console.log("Comment notification dispatched");
    } else {
      console.log("Error dispatching comment notification");
    }
  }, [userId, displayName, newComment]);

  const createComment = useCallback(async () => {
    const response = await axios.post(`${postId}/comments/`, {
      comment: newComment,
      contentType: "comment",
    });

    if (response.status === 201) {
      dispatchCommentNotification();
      fetchComments();
      setNewComment("");
    } else {
      console.error("Error submitting comment");
    }
  }, [postId, newComment, fetchComments, dispatchCommentNotification]);

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
