import React, { useContext } from "react";
import UserCard from "./UserCard";
import Post from "../post/Post";
import { Box, Grid, Typography } from "@mui/material"; // Import Typography
import useProfileViewModel from "../../api/ProfileViewModel";
import useEventsViewModel from "./EventsViewModel";
import { StoreContext } from "./../../store";
import EventTile from "./EventTile";

function ProfilePage({ isOwner = true }) {
  const { state } = useContext(StoreContext);
  const { posts, followers } = useProfileViewModel();
  const { events } = useEventsViewModel();

  let likes = 0;
  posts.forEach((post) => (likes += post.count));

  return (
    <Box>
      <Grid container spacing={2} sx={{ p: 3 }}>
        <Grid item xs={12}>
          <UserCard
            isOwner={isOwner}
            followersCount={followers.length}
            postsCount={posts.length}
            name={state.user.username}
            username={state.user.username}
            github={state.user.github}
            likesCount={likes}
            imagePath={state.user.profileImage}
          />
        </Grid>

        <Grid item xs={12} md={7}>
          <Typography
            sx={{
              background: "#ff006e",
              color: "white",
              padding: 2,
              borderRadius: 1,
              fontWeight: "bold",
            }}
          >
            Posts
          </Typography>
          <Box
            sx={{
              height: "calc(100vh - 64px)",
              overflow: "auto",
            }}
          >
            {posts.map((post, index) => (
              <Post key={index} post={post} padding={1} margin={1} />
            ))}
          </Box>
        </Grid>
        <Grid item xs={12} md={5}>
          <Typography
            sx={{
              background: "#0d1321",
              color: "white",
              padding: 2,
              borderRadius: 1,
              fontWeight: "bold",
            }}
          >
            Github Activity
          </Typography>
          <Box
            sx={{
              height: "calc(100vh - 64px)",
              overflow: "auto",
            }}
          >
            {events.map((event, index) => (
              <EventTile key={index} type={event.type} name={event.repo.name} />
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProfilePage;
