import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { StoreContext, useStore } from "./../store";
import { createUrlFromId } from "./helper";
import { useParams, useLocation } from "react-router-dom";

const useProfileViewModel = () => {
  const { dispatch } = useStore();
  const { state } = useContext(StoreContext);
  const authToken = state.token;

  const [profileData, setProfile] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [posts, setPosts] = useState([]);

  const { userId } = useParams();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const authorId = queryParams.get("authorId");

  useEffect(() => {
    const baseUrl = createUrlFromId(userId);

    const fetchPosts = async () => {
      var url = authorId;
      if (url == null) {
        url = baseUrl;
      }

      if (url.startsWith(process.env.REACT_APP_API_URL)) {
        try {
          const response = await axios.get(`${baseUrl}/posts/`, {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          });

          if (response.status === 200) {
            var data = response.data.items;

            if (baseUrl !== state.user.id) {
              data = data.filter(
                (post) => post.visibility.toLowerCase() === "public"
              );
            }
            setPosts(data);
          } else {
            console.error("Error fetching posts");
          }
        } catch (e) {
          console.log("cant fetch posts", e);
        }
      } else if (url.startsWith(process.env.REACT_APP_TEAM_TWO_URL)) {
        const creds = "Segfault:Segfault1!";
        const base64Credentials = btoa(creds);

        const response = await axios.get(`${url}/posts/`, {
          headers: {
            Authorization: `Basic ${base64Credentials}`,
          },
        });
        if (response.status === 200) {
          const data = response.data.data;
          setPosts(data);
        } else {
          console.error(
            `Couldn't fetch posts. Status code: ${response.status}`
          );
          return [];
        }
      }
    };

    const fetchFollowers = async () => {
      try {
        const response = await axios.get(`${baseUrl}/followers/`, {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });

        if (response.status === 200) {
          const data = response.data;
          setFollowers(data);
        } else {
          console.error("Error fetching authors");
        }
      } catch {
        console.log("cant fetch posts");
      }
    };

    const fetchProfileData = async () => {
      // Helper method to fetch all authors (including yourself)
      var url = authorId;
      if (url == null) {
        url = baseUrl;
      }

      if (url.startsWith(process.env.REACT_APP_API_URL)) {
        const response = await axios.get(`${baseUrl}`, {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });
        if (response.status === 200) {
          setProfile(response.data);
        } else {
          console.error(
            `Couldn't fetch authors. Status code: ${response.status}`
          );
        }
      } else if (url.startsWith(process.env.REACT_APP_TEAM_TWO_URL)) {
        const creds = "Segfault:Segfault1!";
        const base64Credentials = btoa(creds);

        const response = await axios.get(`${url}`, {
          headers: {
            Authorization: `Basic ${base64Credentials}`,
          },
        });

        if (response.status === 200) {
          setProfile(response.data);
        } else {
          console.error("Could not fetch team 2 author");
        }
      }
    };

    fetchProfileData(baseUrl);
    fetchFollowers();
    fetchPosts();
  }, [userId, authToken, authorId]);

  const updateProfile = async ({ username, github, image }) => {
    // Updates the profile.
    const body = {
      displayName: username,
      github,
      profileImage: image,
    };
    const url = state.user.id;

    const response = await axios.post(`${url}/`, body, {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    });
    if (response.status === 200) {
      const user = {
        id: url,
        username: response.data.displayName,
        profileImage: response.data.profileImage,
        github: response.data.github,
      };
      dispatch({ type: "SET_USER", payload: user });
      setProfile(response.data);
      console.log("Profile updated");
    } else {
      console.error("Error creating profile");
    }
  };

  return {
    posts,
    profileData,
    followers,
    updateProfile,
  };
};

export default useProfileViewModel;
