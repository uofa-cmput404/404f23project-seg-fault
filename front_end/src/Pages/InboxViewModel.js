import { useEffect, useContext, useCallback, useState } from "react";
import axios from "axios";
import { StoreContext } from "../store";

const useInboxViewModel = () => {
  const { state } = useContext(StoreContext);
  const userId = state.user.id;
  const authToken = state.token;

  const [inbox, setInbox] = useState([]);

  const getInbox = useCallback(async () => {
    const response = await axios.get(`${userId}/inbox/`, {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    });

    if (response.status === 200) {
      setInbox(response.data.items);
    } else {
      console.log("Error fetching inbox");
    }
  }, [userId, authToken]);

  const clearInbox = useCallback(async () => {
    const response = await axios.delete(`${userId}/inbox/`, {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    });

    if (response.status === 200 || response.status === 201) {
      setInbox({});
      window.location.reload();
      console.log("Inbox cleared successfully");
    } else {
      console.log("Error clearing inbox");
    }
  }, [userId, authToken]);

  useEffect(() => {
    getInbox();
  }, [getInbox]);

  return {
    inbox,
    clearInbox,
  };
};

export default useInboxViewModel;
