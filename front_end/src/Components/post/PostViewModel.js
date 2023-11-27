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
    if (props.post.id.startsWith(process.env.REACT_APP_API_URL)) {
      const response = await axios.get(`${props.post.id}/likes/`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });

      if (response.status === 200) {
        const liked = response.data.items.some(
          (like) => like.author.id === userId
        );
        setLiked(liked);
        setLikes(response.data.items);
      } else {
        console.error("Error fetching likes");
      }
    } else if (props.id.startsWith(process.env.REACT_APP_TEAM_ONE_URL)) {
      // TODO: Group one is still working on inbox and comments
      const creds = "vibely:string";
      const base64Credentials = btoa(creds);

      const response = await axios.get(`${props.id}/likes/`, {
        headers: {
          Authorization: `Basic ${base64Credentials}`,
        },
      });

      if (response.status === 201) {
        const liked = response.result.items.some(
          (like) => like.author.id === userId
        );
        setLiked(liked);
        setLikes(response.result.items);
      } else {
        console.error("Error fetching likes");
      }
    }
  }, [props.post.id, userId, authToken]);

  const likePost = useCallback(async () => {
    if (props.id.startsWith(process.env.REACT_APP_API_URL)) {

      const user = await axios.get(userId + "/", {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });

      const payload = {
        context: "https://www.w3.org/ns/activitystreams",
        summary: `${user.data.displayName} Likes your post`,
        type: "Like",
        author: user.data,
        object: props.post.id,
      };

      const response = await axios.post(`${props.post.author.id}/inbox/`, payload, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });

      if (response.status === 200) {
        fetchLikes();
      } else {
        console.log(response.status);
        console.error("Error liking post");
      }
    } else if (props.id.startsWith(process.env.REACT_APP_TEAM_ONE_URL)) {
      // TODO: Group one is still working on inbox and comments
      const creds = "vibely:string";
      const base64Credentials = btoa(creds);

      const user = await axios.get(userId + "/", {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });

      const payload = {
        context: "https://www.w3.org/ns/activitystreams",
        summary: `${user.data.displayName} Likes your post`,
        type: "Like",
        author: user.data,
        object: props.id,
      };

      const response = await axios.post(`${props.userId}/inbox/`, payload, {
        headers: {
          Authorization: `Basic ${base64Credentials}`,
        },
      });

      if (response.status === 200) {
        fetchLikes();
      } else {
        console.log(response.status);
        console.error("Error liking post");
      }
    }
  }, [props.userId, userId, props.id, fetchLikes, authToken]);

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
