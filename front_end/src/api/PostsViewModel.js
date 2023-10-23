import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { StoreContext } from "../store";

const usePostsViewModel = () => {
  const { state } = useContext(StoreContext);
  const userId = state.user.id;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    // Fetches all public, friend posts or user posts

    const fetchAuthors = async () => {
      // Helper method to fetch all authors (including yourself)
      const users_response = await axios.get(
        "http://127.0.0.1:8000/api/authors"
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

    const fetchFollowingUsersIds = async () => {
      // Helper method to fetch the Ids of all the users you are following
      const following_response = await axios.get(`${userId}/following/`);
      if (following_response.status === 200) {
        return following_response.data.map((item) => item.user.id);
      } else {
        console.error(
          `Couldn't fetch following users. Status code: ${following_response.status}`
        );
        return [];
      }
    };

    const fetchPostsByAuthor = async (author) => {
      // Helper method to fetch the posts of an specific author
      const posts_response = await axios.get(`${author.url}/posts/`);
      if (posts_response.status === 200) {
        return posts_response.data.items;
      } else {
        console.error(
          `Couldn't fetch posts. Status code: ${posts_response.status}`
        );
        return [];
      }
    };

    const filterPosts = (allPosts, followingUsersIds) => {
      // Helper method to filter posts based on visibility, friends posts or your own posts
      return allPosts.filter(
        (item) =>
          item.visibility === "public" ||
          item.author.id === userId ||
          (followingUsersIds.includes(item.author.id) &&
            item.visibility === "friends")
      );
    };

    try {
      const authors = await fetchAuthors();
      const followingUsersIds = await fetchFollowingUsersIds();

      const allPosts = (
        await Promise.all(authors.map((author) => fetchPostsByAuthor(author)))
      ).flat();

      const filteredPosts = filterPosts(allPosts, followingUsersIds);

      setPosts(filteredPosts);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  }, [userId]);

  const createPost = async (
    title,
    description,
    contentType,
    content,
    visibility
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
    };

    const response = await axios.post(`${userId}/posts/`, body);
    if (response.status === 200) {
      console.log("Post created");
    } else {
      console.error("Error creating post");
    }
  };

  const deletePost = async (postId) => {
    const response = await axios.delete(postId);

    if (response.status === 200) {
      console.error("Deleted");
    } else {
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

    const response = await axios.put(postId, body);
    if (response.status === 200) {
      console.log("Post updated");
    } else {
      console.error("Error updating post");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    loading,
    posts,
    fetchPosts,
    createPost,
    deletePost,
    editPost,
  };
};

export default usePostsViewModel;
