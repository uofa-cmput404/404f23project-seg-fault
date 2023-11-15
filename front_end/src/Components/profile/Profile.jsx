import React, { useContext, useState } from "react";
import UserCard from "./UserCard";
import Post from "../post/Post";
import { Fab } from "@mui/material";
import { Box, Grid, Typography } from "@mui/material"; // Import Typography
import useProfileViewModel from "../../api/ProfileViewModel";
import { StoreContext } from './../../store';
import CreatePost from "../createpost/CreatePost";
import { extractIdFromUrl } from "../../api/helper";
import  { Navigate } from 'react-router-dom';
import useEventsViewModel from "./EventsViewModel";
import AddIcon from '@mui/icons-material/Add';

import EventTile from "./EventTile";

function ProfilePage({userId}) {
    const { state } = useContext(StoreContext);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const {posts, followers, profileData} = useProfileViewModel();
    const { events } = useEventsViewModel();
    
    // Verifies if the owner's id is same as that in the url.
    const isOwner = extractIdFromUrl(state.user.id) === userId;

    const openCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
      setIsCreateModalOpen(false);
    };

    let likes = 0;
    posts.forEach((post) => (likes += post.count));

    // Redirect to home page if profile does not exist.
    if (!profileData) {
        return <Navigate to='/home'  />
    }

  return (
    <Box>
      <Grid container spacing={2} sx={{ p: 3 }}>
        <Grid item xs={12}>
          <UserCard
            isOwner={isOwner}
            followersCount={followers.length}
            postsCount={posts.length}
            name={profileData.displayName}
            username={profileData.displayName}
            github={profileData.github}
            likesCount={likes}
            imagePath={profileData.profileImage}
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
          {isOwner ? (
                <Fab
                    color="primary"
                    aria-label="add"
                    style={{ position: 'fixed', top: '20rem', right: '5rem' }}
                    onClick={openCreateModal}
                >
                    <AddIcon />
                </Fab>
            ) : null}
            {isCreateModalOpen && <CreatePost open={isCreateModalOpen} onClose={closeCreateModal} action='CREATE' />}
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
