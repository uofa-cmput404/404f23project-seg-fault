import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import * as bootIcons from "react-icons/bs";
import AuthorTile from "../Components/friends/authorTile";
import useFriendsViewModel from "./FriendsViewModel";
import Button from "@mui/material/Button";

function Friends() {
  const {
    selectedView,
    changeView,
    currentPage,
    nextPage,
    previousPage,
    followers,
    followAuthor,
    unfollowAuthor,
    authorStatus,
    filteredAuthors,
  } = useFriendsViewModel();

  return (
    <Box px={{ md: 22 }} sx={{ paddingTop: "10px" }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{ backgroundColor: "#ffffff" }}
      >
        <Container maxWidth="md">
          <Toolbar disableGutters>
            <bootIcons.BsPeopleFill
              style={{ fontSize: "1.5rem", color: "#adb5bd" }}
            />
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
                color: "#adb5bd",
                textDecoration: "none",
                justifyContent: "space-between",
              }}
            >
              Social Hub
            </Typography>
            <Button
              onClick={() => changeView("authors")}
              color="primary"
              sx={{
                paddingRight: 2,
                marginRight: 2,
                color: "#adb5bd",
                textTransform: "capitalize",
              }}
            >
              Authors
            </Button>
            <Button
              onClick={() => changeView("followers")}
              color="primary"
              sx={{
                marginRight: 2,
                color: "#adb5bd",
                textTransform: "capitalize",
              }}
            >
              Friends
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
        {selectedView === "authors" &&
          filteredAuthors.map((author, index) => (
            <AuthorTile
              key={index}
              id={author.id}
              username={author.displayName}
              profilePic={author.profileImage}
              remoteAuthor={author.remote}
              status="follow"
              authorAction={followAuthor}
              authorStatus={authorStatus}
            />
          ))}
        {selectedView === "followers" &&
          followers.map((author, index) => (
            <AuthorTile
              key={index}
              id={author.items[0].id}
              username={author.items[0].displayName}
              profilePic={author.items[0].profileImage}
              remoteAuthor={author.remote}
              status="friend"
              authorAction={unfollowAuthor}
            />
          ))}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginY: 2,
          }}
        >
          <Button onClick={previousPage} disabled={currentPage === 1}>
            <bootIcons.BsArrowLeft />
          </Button>
          <Typography sx={{ marginX: 2 }}>{currentPage}</Typography>
          <Button onClick={nextPage}>
            <bootIcons.BsArrowRight />
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Friends;
