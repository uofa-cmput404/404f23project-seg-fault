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
    // Fetch all the likes of a post
    if (props.post.id.startsWith(process.env.REACT_APP_API_URL)) {
      const response = await axios.get(`${props.post.id}/likes/`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });

      if (response.status === 200) {
        setLikes(response.data.items);
      } else {
        console.error("Error fetching likes");
      }
    } else if (props.post.id.startsWith(process.env.REACT_APP_TEAM_ONE_URL)) {
      try {
        // Get likes for team 1
        const creds = "vibely:string";
        const base64Credentials = btoa(creds);

        const urls = props.post.id.split("https://");
        const actualURL = urls[urls.length - 1];

        const response = await axios.get(`https://${actualURL}likes/`, {
          headers: {
            Authorization: `Basic ${base64Credentials}`,
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
      } catch (error) {
        console.error("An error occurred:", error);
      }
    } else if (props.post.author.id.startsWith(process.env.REACT_APP_TEAM_TWO_URL)) {
      try {
        const creds = "Segfault:Segfault1!";
        const base64Credentials = btoa(creds);
        let url = props.post.id;
        if (!url.includes("/api")) {
          url = url.replace(/^(https?:\/\/[^\/]+)(\/.*)$/, '$1/api$2');
        }
        const response = await axios.get(`${url}/likes`, {
          headers: {
            Authorization: `Basic ${base64Credentials}`,
          },
        });
  
        if (response.status === 200) {
          setLikes(response.data.items);
        } else {
          console.error("Error fetching likes");
        }
      } catch (error) {
        console.error("An error occurred while fetching team 2 likes:", error);
      }
    }
  }, [props.post.id, userId, authToken]);

  const likePost = useCallback(async () => {
    console.log(props.post.id)
    if (props.post.id.startsWith(process.env.REACT_APP_API_URL)) {
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

      const response = await axios.post(
        `${props.post.author.id}/inbox/`,
        payload,
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );

      if (response.status === 201) {
        fetchLikes();
        setLiked(true);
      } else {
        console.error("Error liking post");
      }
    } else if (props.post.id.startsWith(process.env.REACT_APP_TEAM_ONE_URL)) {
      try {
        // Get likes for team 1
        const creds = "vibely:string";
        const base64Credentials = btoa(creds);

        const urls = props.post.author.id.split("https://");
        const actualURL = urls[urls.length - 1];

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

        const response = await axios.post(
          `https://${actualURL}inbox/`,
          {
            items: payload,
          },
          {
            headers: {
              Authorization: `Basic ${base64Credentials}`,
            },
          }
        );

        if (response.status === 201) {
          setLiked(liked);
          fetchLikes();
        } else {
          console.error("Error fetching likes");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    } else if (props.post.author.id.startsWith(process.env.REACT_APP_TEAM_TWO_URL)) {
      try {
        const creds = "Segfault:Segfault1!";
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
          object: props.post.id,
        };

        const response = await axios.post(
          `https://${props.post.author.id}/inbox/`,
          {
            items: payload,
          },
          {
            headers: {
              Authorization: `Basic ${base64Credentials}`,
            },
          }
        );

        if (response.status === 201) {
          console.log("liked!")
          setLiked(liked);
          fetchLikes();
        } else {
          console.error("Error fetching likes");
        }
      } catch (error) {
        console.error("An error occurred while liking team 2 post:", error);
      }
    }

  }, [props.post.id, props.post.author.id, userId, fetchLikes, authToken]);

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
