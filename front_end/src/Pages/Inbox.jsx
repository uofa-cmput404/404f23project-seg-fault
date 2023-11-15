import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import * as bootIcons from "react-icons/bs";
import InboxElement from "../Components/inbox/inboxElement";
import useInboxViewModel from "./InboxViewModel";
import Post from "../Components/post/Post";
import { Button } from "@mui/material";

function Inbox() {
  const { inbox, clearInbox } = useInboxViewModel();

  return (
    <Box px={{ md: 22 }} sx={{ paddingTop: "10px" }}>
      <AppBar position="static" sx={{ backgroundColor: "#3a86ff" }}>
        <Container maxWidth="md">
          <Toolbar disableGutters>
            <bootIcons.BsEnvelopePaperFill style={{ fontSize: "1.5rem" }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                ml: 2,
                display: { xs: "none", md: "flex" },
                fontSize: "20px",
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Your Inbox
            </Typography>
            <Button
              variant="contained"
              onClick={clearInbox}
              style={{ marginLeft: "30rem" }}
            >
              Clear
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {inbox.map((element, index) => {
          if (element.type === "post") {
            return <Post post={element} width={600} padding={1} margin={1} />;
          }
          if (element.type === "comment") {
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
          if (element.type === "Like") {  
            return (
              <InboxElement
                key={index}
                username={element.displayName}
                profilePic=""
                text={element.summary}
                visibility={element.type}
                author={element.author}
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
