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
                `${process.env.REACT_APP_API_URL}/authors/`
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
            // Helper method to fetch the posts of a specific author
            if (author.id.startsWith(process.env.REACT_APP_API_URL)) {
                // get local posts
                const posts_response = await axios.get(`${author.url}/posts/`);
                if (posts_response.status === 200) {
                    return posts_response.data.items;
                } else {
                    console.error(
                        `Couldn't fetch posts. Status code: ${posts_response.status}`
                    );
                    return [];
                }
            } else if (author.id.startsWith(process.env.REACT_APP_TEAM_ONE_URL)) {
                // get team one posts
                const creds = 'string:string';
                const base64Credentials = btoa(creds);
                const posts_response = await axios.get(`${author.url}/posts/`,
                    {
                        headers: {
                            'Authorization': `Basic ${base64Credentials}`,
                        },
                    }
                  );
                if (posts_response.status === 200) {
                    const team1_posts = posts_response.data.results;
                    const posts = []

                    for (const team1_post of team1_posts){
                        let content = team1_post.content
                        if (team1_post.image) {
                            content = `${process.env.REACT_APP_TEAM_ONE_URL}/${team1_post.image}`
                        } else if (team1_post.image_link) {
                            content = team1_post.image_link
                        }

                        posts.push({
                            "type": "post",
                            "title": team1_post.title,
                            "id": `${process.env.REACT_APP_TEAM_ONE_URL}/authors/${team1_post.author.id}/posts/${team1_post.id}`,
                            "source": `${process.env.REACT_APP_TEAM_ONE_URL}/authors/${team1_post.author.id}/posts/${team1_post.id}`,
                            "origin": `${process.env.REACT_APP_TEAM_ONE_URL}/authors/${team1_post.author.id}/posts/${team1_post.id}`,
                            "description": team1_post.description,
                            "contentType": "text/plain",
                            "content": content,
                            "author": {
                                "type": "author",
                                "id": `${process.env.REACT_APP_TEAM_ONE_URL}/authors/${team1_post.author.id}`,
                                "host": process.env.REACT_APP_TEAM_ONE_URL,
                                "displayName": team1_post.author.username,
                                "url": `${process.env.REACT_APP_TEAM_ONE_URL}/authors/${team1_post.author.id}`,
                                "github": team1_post.author.github,
                                "profileImage": team1_post.author.image
                            },
                            "categories": [
                                "none"
                            ],
                            "count": team1_post.count,
                            "comments": null,
                            "published": team1_post.published,
                            "visibility": team1_post.visibility.toLowerCase(),
                            "unlisted": false
                        });
                        
                    }
                    return posts;
                } else {
                    console.error(
                        `Couldn't fetch posts. Status code: ${posts_response.status}`
                    );
                    return [];
                }
            }
        };

        const filterPosts = (allPosts) => {
            // Helper method to filter posts based on visibility, friends posts or your own posts
            allPosts = allPosts.filter(
                (item) =>
                    item.visibility === "public"
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
    }, []);

    const fetchFollowers = useCallback(async () => {
        const parts = userId.split("/");
        const userGuid = parts[parts.length - 1];
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/authors/${userGuid}/followers/`
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

        const followers = await fetchFollowers();
        for (let follower of followers) {
            console.log(follower);
            const followerUrl = follower.follower.url;
            const postUrl = response.data.data.url;
            const post_res = await axios.get(postUrl);
            await axios.post(`${followerUrl}/inbox/`, post_res.data)
        }
    };

    const deletePost = async (postId) => {
        const response = await axios.delete(postId);

        if (response.status === 204) {
            console.log("Deleted");
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
        editPost
    };
};

const fetchProfileData = async (url) => {
    // Helper method to fetch all authors (including yourself)
    const users_response = await axios.get(
        `${process.env.REACT_APP_API_URL}/authors/`
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