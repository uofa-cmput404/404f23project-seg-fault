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
                "http://127.0.0.1:8000/api/authors/"
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

        const isFollowing = async (author) => {
            // Helper method to fetch the posts of an specific author
            const followers_response = await axios.get(`${author.url}/followers/`);
            if (followers_response.status === 200) {
                for (let follower of followers_response.data.items) {
                    if (follower.follower.id === userId) {
                        return true
                    }
                }
            } else {
                console.error(
                    `Couldn't fetch followers. Status code: ${followers_response.status}`
                );
            }
            return false;
        };

        const fetchFollowingUsersIds = async (authors) => {
            const following = []
            for (let author of authors) {
                const isUserFollowing = await isFollowing(author);
                if ( isUserFollowing ) {
                    following.push(author.id)
                }
            }
            return following;
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
            allPosts = allPosts.filter(
                (item) =>
                    item.visibility === "public" ||
                    item.author.id === userId ||
                    (followingUsersIds.includes(item.author.id) &&
                        (item.visibility === "friends"))
            );


            return allPosts.sort((a, b) => {
                const dateA = new Date(a.published);
                const dateB = new Date(b.published);
              
                return dateB - dateA;
              });
        };

        try {
            const authors = await fetchAuthors();
            const followingUsersIds = await fetchFollowingUsersIds(authors);

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

    const fetchFollowers = useCallback(async () => {
        const parts = userId.split("/");
        const userGuid = parts[parts.length - 1];
        const response = await axios.get(
          `http://127.0.0.1:8000/api/authors/${userGuid}/followers/`
        );
        if (response.status === 200) {
          return response.data.items;
        } else {
          console.error("Error fetching followers");
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

        const followers = await fetchFollowers();
        for (let follower of followers) {
            console.log(follower);
            const followerUrl = follower.follower.url;
            const postUrl = response.data.data.url
            const post_res = await axios.get(postUrl);
            await axios.post(`${followerUrl}/inbox/`, post_res.data)
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

        const response = await axios.post(postId, body);
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