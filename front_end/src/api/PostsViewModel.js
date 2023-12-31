import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { StoreContext } from "../store";
import { convertTeamOnePostToVibelyPost } from "./helper";
import useShareViewModel from "../Components/share/ShareViewModel";

const usePostsViewModel = () => {
  const { state } = useContext(StoreContext);
  const userId = state.user.id;
  const authToken = state.token;
  const { followers, sharePost } = useShareViewModel();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    // Fetches all public, friend posts or user posts

    const fetchAuthors = async () => {
      // Helper method to fetch all authors (including yourself)
      const users_response = await axios.get(
        `${process.env.REACT_APP_API_URL}/authors/`,
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );

      if (users_response.status === 200) {
        return users_response.data.items;
      } else {
        console.error(
          `Couldn't fetch authors. Status code: ${users_response.status}`
        );
        return [];
      }
    };

    const fetchPostsByAuthor = async (author) => {
      if (author.id.startsWith(process.env.REACT_APP_API_URL)) {
        if (author.displayName !== "tom") {
          // get local posts
          const posts_response = await axios.get(`${author.url}/posts/`, {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          });
          if (posts_response.status === 200) {
            return posts_response.data.items;
          } else {
            console.error(
              `Couldn't fetch posts. Status code: ${posts_response.status}`
            );
            return [];
          }
        }
      } else if (author.id.startsWith(process.env.REACT_APP_TEAM_ONE_URL)) {
        // // // get team one posts
        const creds = "vibely:string";
        const base64Credentials = btoa(creds);
        const posts_response = await axios.get(`${author.url}posts/`, {
          headers: {
            Authorization: `Basic ${base64Credentials}`,
          },
        });
        if (posts_response.status === 200) {
          const team1_posts = posts_response.data.items;
          const posts = [];
          for (const team1_post of team1_posts) {
            posts.push(convertTeamOnePostToVibelyPost(team1_post));
          }
          return posts;
        } else {
          console.error(
            `Couldn't fetch posts. Status code: ${posts_response.status}`
          );
          return [];
        }
      } else if (author.id.startsWith(process.env.REACT_APP_TEAM_TWO_URL)) {
        try {
          // get team two posts
          const creds = "Segfault:Segfault1!";
          const base64Credentials = btoa(creds);
          const posts_response = await axios.get(`${author.id}/posts/`, {
            headers: {
              Authorization: `Basic ${base64Credentials}`,
            },
          });
          if (posts_response.status === 200) {
            return posts_response.data.data;
          } else {
            console.error(
              `Couldn't fetch posts. Status code: ${posts_response.status}`
            );
            return [];
          }
        } catch (error) {
          console.error("Couldn't fetch team 2 posts: ", error);
          return [];
        }
      } else if (author.id.startsWith(process.env.REACT_APP_TEAM_THREE_URL)) {
        try {
          const creds = "sean:admin";
          const base64Credentials = btoa(creds);
          const posts_response = await axios.get(`${author.id}/posts/`, {
            headers: {
              Authorization: `Basic ${base64Credentials}`,
            },
          });
          if (posts_response.status === 200) {
            if (posts_response.data.items !== undefined){
              return posts_response.data.items;
            } else {
              return [];
            }
          } else {
            console.error(
              `Couldn't fetch team 3 posts. Status code: ${posts_response.status}`
            );
            return [];
          }
        } catch (error) {
          console.error("An error occurred:", error);
          return [];
        }
      }
      return [];
    };

    const filterPosts = (allPosts) => {
      // Helper method to filter posts based on visibility, friends posts or your own posts
      allPosts = allPosts.filter(
        (item) =>
          item.visibility.toLowerCase() === "public" && item.unlisted === false
      );

      return allPosts.sort((a, b) => {
        const dateA = new Date(a.published);
        const dateB = new Date(b.published);

        return dateB - dateA;
      });
    };

    try {
      const authors = await fetchAuthors();

      const allPosts = (
        await Promise.all(authors.map((author) => fetchPostsByAuthor(author)))
      ).flat();

      const filteredPosts = filterPosts(allPosts);

      setPosts(filteredPosts);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  }, [authToken]);

  const createPost = async (
    title,
    description,
    contentType,
    content,
    visibility,
    recipient
  ) => {
    // Creates a new posts
    const body = {
      title,
      description,
      contentType,
      content,
      published: null,
      visibility,
      unlisted: false,
      categories: "none",
      recipient,
    };

    // create the post
    const response = await axios.post(`${userId}/posts/`, body, {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    });

    // send the post to inboxes;
    if (response.status === 201) {
      if (visibility === "private") {
        const author_response = await fetchProfileData(
          state.user.id,
          authToken
        );
        // send to the recipient's inbox
        const inbox_payload = {
          ...response.data.data,
          id: response.data.id,
          type: "post",
          author: author_response,
          source: author_response.displayName,
          origin: recipient.displayName,
        };
        delete inbox_payload["url"];

        await axios.post(`${recipient.id}/inbox/`, inbox_payload, {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });
        console.log("Sent to recipient's inbox.");
      } else if (visibility === "friends") {
        const postUrl = response.data.data.url;
        const post_res = await axios.get(postUrl, {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });
        sendFriendPosts(post_res.data);
      }
    } else {
      console.log(`not working ${response.status}`);
    }
  };

  const sendFriendPosts = async (post) => {
    for (let follower of followers) {
      const followerUrl = follower.url;
      sharePost(post, followerUrl);
    }
  };

  const deletePost = async (postId) => {
    const response = await axios.delete(postId, {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    });

    if (response.status === 204) {
      console.log("Deleted");
      window.location.reload();
    } else {
      console.log(response.status);
      console.error("Error deleting post");
    }
  };

  const editPost = async (
    title,
    description,
    contentType,
    content,
    visibility,
    postId
  ) => {
    // Edits a post
    const body = {
      title,
      description,
      contentType,
      content,
      published: null,
      visibility,
      unlisted: false,
      categories: "none",
    };

    const response = await axios.post(postId, body, {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    });
    if (response.status === 200) {
      console.log("Post updated");
    } else {
      console.error("Error updating post");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    loading,
    posts,
    fetchPosts,
    createPost,
    deletePost,
    editPost,
  };
};

const fetchProfileData = async (url, authToken) => {
  // Helper method to fetch all authors (including yourself)
  const users_response = await axios.get(
    `${process.env.REACT_APP_API_URL}/authors/`,
    {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    }
  );
  if (users_response.status === 200) {
    const foundUserData = users_response.data.items.find(
      (item) => item.id === url
    );
    return foundUserData;
  } else {
    console.error(
      `Couldn't fetch authors. Status code: ${users_response.status}`
    );
  }
};

export default usePostsViewModel;
