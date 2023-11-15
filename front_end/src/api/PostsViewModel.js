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
                        console.log('i shouldnt be ablt to see this')
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

    const createPost = async (
        title,
        description,
        contentType,
        content,
        visibility,
        recipient
    ) => {
        try {
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
                recipient
            };

            const response = await axios.post(`${userId}/posts/`, body);
            const author_response = await fetchProfileData(state.user.id);
            console.log("Post created");
            if(visibility === "private") {
                // send to the recipient's inbox
                const inbox_payload = {...response.data.data, 
                                        id: response.data.id, type: "post", author: author_response, 
                                        source: author_response.displayName, origin: recipient.displayName};
                delete inbox_payload["url"];

                await axios.post(`${recipient.id}/inbox/`, inbox_payload);
                console.log("Sent to recipient's inbox.");
            }
            } catch(e) {
            console.error("Error creating post or sending to inbox");
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

const fetchProfileData = async (url) => {
    // Helper method to fetch all authors (including yourself)
    const users_response = await axios.get(
        "http://127.0.0.1:8000/api/authors/"
    );
    if (users_response.status === 200) {                
        const foundUserData = users_response.data.items.find(item => item.id === url);
        return foundUserData;
    } else {
        console.error(
            `Couldn't fetch authors. Status code: ${users_response.status}`
        );
    }
  };

export default usePostsViewModel;