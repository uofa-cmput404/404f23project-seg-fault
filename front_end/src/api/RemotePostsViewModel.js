import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useRemotePostsViewModel = () => {
    const [remotePosts, setRemotePosts] = useState([]);
    const [loadingRemotePosts, setLoadingRemotePosts] = useState(true);

    const fetchPosts = useCallback(async () => {
        // Fetches all public, friend posts or user posts
        const fetchRemoteAuthors = async() => {
            const users_response = await axios.get(
                `${process.env.REACT_APP_TEAM_ONE_URL}/authors/`
            );
            if (users_response.status === 200) {
                return users_response.data.results;
            } else {
                console.error(
                    `Couldn't fetch authors. Status code: ${users_response.status}`
                );
                return [];
            }
        }

        const  fetchRemotePostsByAuthor = async (author) => {
            // Helper method to fetch the posts of an specific author
            const posts_response = await axios.get(`${process.env.REACT_APP_TEAM_ONE_URL}/authors/${author.id}/posts/`);
            if (posts_response.status === 200) {
                return posts_response.data.results;
            } else {
                console.error(
                    `Couldn't fetch remote posts. Status code: ${posts_response.status}`
                );
                return [];
            }
        };

        const filterRemotePosts = (allPosts) => {
            allPosts = allPosts.filter(
                (item) =>
                    item.visibility === "PUBLIC"
            );


            return allPosts.sort((a, b) => {
                const dateA = new Date(a.published);
                const dateB = new Date(b.published);
              
                return dateB - dateA;
              });
        }

        try {
            const remoteAuthors = await fetchRemoteAuthors();
            const allRemotePosts = (
                await Promise.all(remoteAuthors.map((author) => fetchRemotePostsByAuthor(author)))
            ).flat();
            const filteredRemotePosts = filterRemotePosts(allRemotePosts);

            setRemotePosts(filteredRemotePosts);
            setLoadingRemotePosts(false);
        } catch (error) {
            console.error("Error:", error);
        }
    }, []);


    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    return {
        remotePosts,
        loadingRemotePosts
    };
};

export default useRemotePostsViewModel;