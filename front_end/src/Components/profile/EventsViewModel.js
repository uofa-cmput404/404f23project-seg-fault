import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { StoreContext } from "../../store";

const useEventsViewModel = () => {
  const { state } = useContext(StoreContext);
  const userId = state.user.id;
  const [events, setEvents] = useState([]);

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
    try {
      const response = await axios.get(`${userId}/`);
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
  }, [userId, fetchGithubEvents]);

  useEffect(() => {
    fetchGithub();
  }, [fetchGithub]);

  return {
    events,
  };
};

export default useEventsViewModel;
