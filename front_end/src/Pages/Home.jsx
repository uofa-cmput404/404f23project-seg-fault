import React from 'react';
import { Box, Stack, Skeleton } from "@mui/material";
import Post from '../Components/post/Post';
import { useState } from "react";
import { tempPosts } from './tempPosts';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import CreatePost from '../Components/createpost/CreatePost';

function Home() {
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  setTimeout(() => {
    setLoading(false);
  }, [1000]);

  return (
    <Box px={{ md: 22 }}>
      {loading ? (
        <Stack spacing={1}>
          <Skeleton variant="text" height={100} />
          <Skeleton variant="text" height={20} />
          <Skeleton variant="text" height={20} />
          <Skeleton variant="rectangular" height={300} />
        </Stack>
      ) : (
        <>
        {tempPosts.map((post, index) =>{
          return (
            <Post 
              username={post.name} 
              profilePic={post.profile}
              photo={post.photo}
              text={post.text}
              visibility={post.visibility}/>
          )
        })}
        </>
      )}
      <Fab 
        color="primary" 
        aria-label="add"
        style={{position: 'fixed', top: '2rem', right: '45rem'}}
        onClick={openCreateModal}>
        <AddIcon />
      </Fab>
      <CreatePost open={isCreateModalOpen} onClose={closeCreateModal} action='CREATE'/>
    </Box>
  );
}

export default Home;
