import { useState, useEffect, useCallback } from "react";
import axios from "axios";

function usePostViewModel(props, userId, markdownContent, setMarkdownContent) {
  const [expandComments, setExpandedComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [share, setShare] = useState(false);
  const [likes, setLikes] = useState([]);

  const fetchLikes = useCallback(async () => {
    const response = await axios.get(`${props.post.id}/likes/`);
    if (response.status === 200) {
      const liked = response.data.items.some(
        (like) => like.author.id === userId
      );
      setLiked(liked);
      setLikes(response.data.items);
    } else {
      console.error("Error fetching comments");
    }
  }, [props.post.id, userId]);

  const likePost = useCallback(async () => {
    const response = await axios.post(`${props.post.author.id}/inbox/`, {
      type: "Like",
      author: userId,
      object: props.post.id,
    });

    if (response.status === 201) {
      fetchLikes();
    } else {
      console.error("Error liking post");
    }
  }, [props.post.author.id, userId, props.post.id, fetchLikes]);

  useEffect(() => {
    fetchLikes();
  }, [fetchLikes]);

  const handleLike = () => {
    if (!liked) {
      likePost();
      setLiked((prev) => !prev);
    }
  };

  const handleShare = () => {
    setShare((prev) => !prev);
  };

  const handleExpandClick = () => {
    setExpandedComments(!expandComments);
  };

  return {
    expandComments,
    liked,
    share,
    likes,
    handleLike,
    handleShare,
    handleExpandClick,
    setMarkdownContent,
  };
}

export default usePostViewModel;
