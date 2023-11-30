import { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { createUrlFromId } from "../../api/helper";
import { StoreContext } from "../../store";

const useEventsViewModel = () => {
  const [events, setEvents] = useState([]);
  const { userId } = useParams();
  const baseUrl = createUrlFromId(userId);
  const { state } = useContext(StoreContext);
  const authToken = state.token;

  const fetchGithubEvents = useCallback(
    async (username) => {
      try {
        const response = await axios.get(
          `https://api.github.com/users/${username}/events`);

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
    try {
      const response = await axios.get(`${baseUrl}/`,
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );
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
  }, [baseUrl, fetchGithubEvents]);

  useEffect(() => {
    fetchGithub();
  }, [fetchGithub]);

  return {
    events,
  };
};

export default useEventsViewModel;
