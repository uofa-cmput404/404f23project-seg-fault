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
    authors,
    followers,
    following,
    followAuthor,
    unfollowAuthor,
  } = useFriendsViewModel();

  const filteredFriends = authors.filter((author) => {
    const isFollower = followers.find(
      (follower) => follower.follower.id === author.id
    );
    const isFollowing = following.find(
      (follow) => follow.user.id === author.id
    );

    return isFollower && isFollowing;
  });

  const filteredAuthors = authors.filter((author) => {
    const isFollowing = following.find(
      (follow) => follow.user.id === author.id
    );

    return !isFollowing;
  });

  return (
    <Box px={{ md: 22 }} sx={{ paddingTop: "10px" }}>
      <AppBar position="static" sx={{ backgroundColor: "#3a86ff" }}>
        <Container maxWidth="md">
          <Toolbar disableGutters>
            <bootIcons.BsPeopleFill style={{ fontSize: "1.5rem" }} />
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
              Social Hub
            </Typography>
            <Button
              onClick={() => changeView("authors")}
              color="primary"
              sx={{
                paddingRight: 2,
                marginRight: 2,
                color: "#ffffff",
                textTransform: "capitalize",
              }}
            >
              Other Authors
            </Button>
            <Button
              onClick={() => changeView("friends")}
              color="primary"
              sx={{
                marginRight: 2,
                color: "#ffffff",
                textTransform: "capitalize",
              }}
            >
              Friends
            </Button>
            <Button
              onClick={() => changeView("followers")}
              color="primary"
              sx={{
                marginRight: 2,
                color: "#ffffff",
                textTransform: "capitalize",
              }}
            >
              You Followers
            </Button>
            <Button
              onClick={() => changeView("following")}
              color="primary"
              sx={{
                marginRight: 2,
                color: "#ffffff",
                textTransform: "capitalize",
              }}
            >
              People you Follow
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
              status="follow"
              authorAction={followAuthor}
            />
          ))}
        {selectedView === "friends" &&
          filteredFriends.map((author, index) => (
            <AuthorTile
              key={index}
              id={author.id}
              username={author.displayName}
              profilePic={author.profileImage}
              status="friend"
              authorAction={unfollowAuthor}
            />
          ))}
        {selectedView === "followers" &&
          followers.map((author, index) => (
            <AuthorTile
              key={index}
              id={author.follower.id}
              username={author.follower.displayName}
              profilePic={author.follower.profileImage}
              status="follower"
              authorAction={followAuthor}
            />
          ))}
        {selectedView === "following" &&
          following.map((author, index) => (
            <AuthorTile
              key={index}
              id={author.user.id}
              username={author.user.displayName}
              profilePic={author.user.profileImage}
              status="unfollow"
              authorAction={unfollowAuthor}
            />
          ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "16px",
        }}
      >
        <Button variant="outlined" color="primary">
          Previous
        </Button>
        <Button variant="outlined" color="primary">
          Next
        </Button>
      </Box>
    </Box>
  );
}

export default Friends;
