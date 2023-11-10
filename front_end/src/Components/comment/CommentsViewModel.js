import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export function useCommentsViewModel(postId, userId) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const fetchComments = useCallback(async () => {
    const response = await axios.get(`${postId}/comments/`);

    if (response.status === 200) {
      setComments(response.data.comments);
    } else {
      console.error("Error fetching comments");
    }
  }, [postId]);

  const dispatchCommentNotification = useCallback(async () => {
    const response = await axios.post(`${userId}/inbox/`, {
      type: "comment",
      comment: newComment,
    });

    if (response.status === 201) {
      console.log("Comment notification dispatched");
    } else {
      console.log("Error dispatching comment notification");
    }
  }, [userId, newComment]);

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
