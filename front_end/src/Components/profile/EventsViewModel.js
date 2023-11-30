import { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { createUrlFromId } from "../../api/helper";
import { StoreContext } from "../../store";

const useEventsViewModel = () => {
  const [events, setEvents] = useState([]);
  const { userId } = useParams();
  const baseUrl = createUrlFromId(userId);
  const { state } = useContext(StoreContext);
  const authToken = state.token;

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const authorId = queryParams.get("authorId");

  const fetchGithubEvents = useCallback(
    async (username) => {
      try {
        const response = await axios.get(
          `https://api.github.com/users/${username}/events`
        );

        if (response.status === 200) {
          setEvents(response.data);
        }
      } catch (e) {
        console.log("Error fetching events");
      }
    },
    [setEvents]
  );

  const fetchGithub = useCallback(async () => {
    if (authorId.startsWith(process.env.REACT_APP_API_URL)) {
      try {
        const response = await axios.get(`${baseUrl}/`, {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });
        if (response.status === 200) {
          const gitUrl = response.data.github.split("/");
          const username = gitUrl[gitUrl.length - 1];

          if (username) {
            fetchGithubEvents(username);
          }
        }
      } catch (e) {
        console.log("Error fetching author");
      }
    } else if (authorId.startsWith(process.env.REACT_APP_TEAM_TWO_URL)) {
      const creds = "segfault:django100";
      const base64Credentials = btoa(creds);

      const response = await axios.get(`${authorId}`, {
        headers: {
          Authorization: `Basic ${base64Credentials}`,
        },
      });

      if (response.status === 200) {
        if (response.data.github) {
          const gitUrl = response.data.github.split("/");
          const username = gitUrl[gitUrl.length - 1];
          fetchGithubEvents(username);
        }
      } else {
        console.error("Could not fetch team 2 author");
      }
    }
  }, [baseUrl, authToken, authorId, fetchGithubEvents]);

  useEffect(() => {
    fetchGithub();
  }, [fetchGithub]);

  return {
    events,
  };
};

export default useEventsViewModel;
