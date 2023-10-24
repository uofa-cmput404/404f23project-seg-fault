import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export function useCommentsViewModel(postId) {
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

  const createComment = useCallback(async () => {
    const response = await axios.post(`${postId}/comments/`, {
      comment: newComment,
      contentType: "comment",
    });

    if (response.status === 201) {
      fetchComments();
      setNewComment("");
    } else {
      console.error("Error submitting comment");
    }
  }, [postId, newComment, fetchComments]);

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
