import { useEffect, useContext, useCallback, useState } from "react";
import axios from "axios";
import { StoreContext } from "../store";

const useInboxViewModel = () => {
  const { state } = useContext(StoreContext);
  const userId = state.user.id;

  const [inbox, setInbox] = useState([]);

  const getInbox = useCallback(async () => {
    const response = await axios.get(`${userId}/inbox/`);

    if (response.status === 200) {
      setInbox(response.data.items);
    } else {
      console.log("Error fetching inbox");
    }
  }, [userId]);

  const clearInbox = useCallback(async () => {
    const response = await axios.delete(`${userId}/inbox/`);

    if (response.status === 200) {
      setInbox({});
      console.log("Inbox cleared successfully");
    } else {
      console.log("Error clearing inbox");
    }
  }, [userId]);

  useEffect(() => {
    getInbox();
  }, [getInbox]);

  return {
    inbox,
    clearInbox,
  };
};

export default useInboxViewModel;
