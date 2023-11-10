import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import * as bootIcons from "react-icons/bs";
import InboxElement from "../Components/inbox/inboxElement";
import useInboxViewModel from "./InboxViewModel";

function Inbox() {
  const { inbox } = useInboxViewModel();

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
            return (
              <InboxElement
                key={index}
                username={element.author.displayName}
                profilePic={element.author.profileImage}
                text={element.content}
                visibility={element.type}
              />
            );
          }
          if (element.type === "comment") {
            return (
              <InboxElement
                key={index}
                username=""
                profilePic=""
                text={element.comment}
                visibility={element.type}
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
