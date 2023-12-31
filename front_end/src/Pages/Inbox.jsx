import * as React from "react";
import Box from "@mui/material/Box";
import InboxElement from "../Components/inbox/inboxElement";
import useInboxViewModel from "./InboxViewModel";
import Post from "../Components/post/Post";
import { Button } from "@mui/material";

function Inbox() {
  const { inbox, clearInbox } = useInboxViewModel();

  return (
    <Box px={{ md: 22 }} sx={{ paddingTop: "10px" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          onClick={clearInbox}
          style={{
            fontSize: "1.8rem",
            color: "#adb5bd",
            textTransform: "none",
            backgroundColor: "transparent",
            boxShadow: "none",
          }}
        >
          Clear X
        </Button>
        {inbox.map((element, index) => {
          if (element.type.toLowerCase() === "post") {
            return <Post post={element} width="60vw" padding={1} margin={1} />;
          }
          if (element.type.toLowerCase() === "comment") {
            return (
              <InboxElement
                key={index}
                username={element.displayName}
                profilePic=""
                text={element.comment}
                visibility={element.type}
              />
            );
          }
          if (element.type.toLowerCase() === "like") {
            return (
              <InboxElement
                key={index}
                username={element.author.displayName}
                profilePic={element.author.profileImage}
                text={element.summary}
                visibility={element.type}
                author={element.author}
              />
            );
          }
          if (element.type.toLowerCase() === "follow") {
            return (
              <InboxElement
                key={index}
                username={element.actor.displayName}
                profilePic={element.actor.profileImage}
                text="Hey let's be friends!"
                visibility={element.type.toLowerCase()}
                author={element.actor}
                inboxData={element}
              />
            );
          }
          return null;
        })}
      </Box>
    </Box>
  );
}

export default Inbox;
