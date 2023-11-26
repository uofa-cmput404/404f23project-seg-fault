import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { StoreContext, useStore } from "./../store";
import { createUrlFromId } from "./helper";
import { useParams } from "react-router-dom";

const useProfileViewModel = () => {
  const { dispatch } = useStore();
  const { state } = useContext(StoreContext);
  const authToken = state.token;

  const [profileData, setProfile] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [posts, setPosts] = useState([]);

  const { userId } = useParams();

  useEffect(() => {
    const baseUrl = createUrlFromId(userId);

    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${baseUrl}/posts/`, {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });

        if (response.status === 200) {
          const data = response.data.items.reverse();
          setPosts(data);
        } else {
          console.error("Error fetching posts");
        }
      } catch {
        console.log("cant fetch posts");
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
          const data = response.data.items;
          setFollowers(data);
        } else {
          console.error("Error fetching authors");
        }
      } catch {
        console.log("cant fetch posts");
      }
    };

    const fetchProfileData = async (url) => {
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
        setProfile(foundUserData);
      } else {
        console.error(
          `Couldn't fetch authors. Status code: ${users_response.status}`
        );
      }
    };

    fetchProfileData(baseUrl);
    fetchFollowers();
    fetchPosts();
  }, [userId, authToken]);

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
