import { useState, useEffect, useCallback } from "react";
import axios from "axios";

function usePostViewModel(props, userId, markdownContent, setMarkdownContent) {
  const [expandComments, setExpandedComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [share, setShare] = useState(false);
  const [likes, setLikes] = useState([]);

  const fetchLikes = useCallback(async () => {
    if (props.type === "local") {
      const response = await axios.get(`${props.id}/likes/`);

      if (response.status === 200) {
        const liked = response.data.items.some(
          (like) => like.author.id === userId
        );
        setLiked(liked);
        setLikes(response.data.items);
      } else {
        console.error("Error fetching likes");
      }
    }
    try {
      if (props.type === "remoteGroup1") {
        const response = await axios.get(
          `${process.env.REACT_APP_TEAM_ONE_URL}/authors/${props.userId}/posts/${props.id}/likes/`
        );

        if (response.status === 200) {
          const liked = response.data.results.some(
            (like) => like.author.id === userId
          );
          setLiked(liked);
          setLikes(response.data.results);
        } else {
          console.error("Error fetching likes for team 1 post.");
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }, [props.id, userId, props.userId, props.type]);

  const likePost = useCallback(async () => {
    if (props.type === "local") {
      const user = await axios.get(userId + "/");

      const payload = {
        context: "https://www.w3.org/ns/activitystreams",
        summary: `${user.data.displayName} Likes your post`,
        type: "Like",
        author: user.data,
        object: props.id,
      };

      const response = await axios.post(`${props.userId}/inbox/`, payload);

      if (response.status === 200) {
        fetchLikes();
      } else {
        console.error("Error liking post");
      }
    }
  }, [props.userId, userId, props.id, fetchLikes, props.type]);

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
