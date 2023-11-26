import { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../store";

function usePostViewModel(props, userId, markdownContent, setMarkdownContent) {
  const { state } = useContext(StoreContext);
  const authToken = state.token;

  const [expandComments, setExpandedComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [share, setShare] = useState(false);
  const [likes, setLikes] = useState([]);

  const fetchLikes = useCallback(async () => {
    if (!props.post.id.startsWith(process.env.REACT_APP_TEAM_ONE_URL)) {
      const response = await axios.get(`${props.post.id}/likes/`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });

      if (response.status === 200) {
        const liked = response.data.items.some(
          (like) => like.author.id === userId
        );
        console.log(liked);
        setLiked(liked);
        setLikes(response.data.items);
      } else {
        console.error("Error fetching likes");
      }
    }

  }, [props.post.id, userId, authToken]);

  const likePost = useCallback(async () => {

    const user = await axios.get(userId + '/', {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });

    const payload = {
      "context": "https://www.w3.org/ns/activitystreams",
      "summary": `${user.data.displayName} Likes your post`,
      "type": "Like",
      "author": user.data,
      "object": props.post.id,
    }

    const response = await axios.post(`${props.post.author.id}/inbox/`, payload, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });

    if (response.status === 200) {
      fetchLikes();
    } else {
      console.log(response.status)
      console.error("Error liking post");
    }

  }, [props.post.author.id, userId, props.post.id, fetchLikes, authToken]);

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
