import { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../store";

export function useCommentsViewModel(postId, userId, displayName) {
  const { state } = useContext(StoreContext);
  const authToken = state.token;
  const localUser = state.user.id;

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const fetchComments = useCallback(async () => {
    // Gets the comment for a post
    if (userId.startsWith(process.env.REACT_APP_API_URL)) {
      // Get comments for Vibely post
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
      try {
        // Get comments for team 1
        const creds = "vibely:string";
        const base64Credentials = btoa(creds);

        const urls = postId.split("https://");
        const actualURL = urls[urls.length - 1];

        const response = await axios.get(`https://${actualURL}comments/`, {
          headers: {
            Authorization: `Basic ${base64Credentials}`,
          },
        });

        if (response.status === 200) {
          setComments(response.data.items);
        } else {
          console.error("Error fetching comments");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    } else if (userId.startsWith(process.env.REACT_APP_TEAM_TWO_URL)) {
      try {
        // Get comments for team 2
        const creds = "Segfault:Segfault1!";
        const base64Credentials = btoa(creds);

        const response = await axios.get(`${postId}/comments`, {
          headers: {
            Authorization: `Basic ${base64Credentials}`,
          },
        });

        if (response.status === 200) {
          setComments(response.data.comments);
        } else {
          console.error("Error fetching comments");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
  }, [postId, userId, authToken]);

  const inboxComment = useCallback(async () => {
    // Send a comment notification to the inbox
    if (userId.startsWith(process.env.REACT_APP_API_URL)) {
      // Inbox comment for Vibely user

      if (localUser !== userId) {
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
    }
  }, [userId, displayName, newComment, authToken, localUser]);

  const createComment = useCallback(async () => {
    // Creates a new comment on the post
    if (userId.startsWith(process.env.REACT_APP_API_URL)) {
      // New commnet for Vibely post
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
        inboxComment();
        setNewComment("");
        fetchComments();
      } else {
        console.log("Error dispatching comment notification");
      }
    } else if (userId.startsWith(process.env.REACT_APP_TEAM_ONE_URL)) {
      try {
        // New comment for team 1 post
        const creds = "vibely:string";
        const base64Credentials = btoa(creds);

        const urls = postId.split("https://");
        const actualURL = urls[urls.length - 1];

        const response = await axios.post(
          `https://${actualURL}comments/`,
          {
            contentType: "comment",
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
      } catch (error) {
        console.error("An error occurred while posting the comment:", error);
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
