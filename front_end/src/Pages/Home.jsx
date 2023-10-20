import React from 'react';
import { Box, Stack, Skeleton } from "@mui/material";
import Post from '../Components/post/Post';
import { useState } from "react";
import { tempPosts } from './tempPosts';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CreatePost from '../Components/createpost/CreatePost';
import HomeIcon from '@mui/icons-material/Home';
import Button from '@mui/material/Button';

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
  }, [200]);

  return (
    <Box px={{ md: 22 }} sx={{paddingTop: "10px"}}>
      <AppBar position="static" sx={{ backgroundColor: '#3a86ff' }}>
      <Container maxWidth="md">
        <Toolbar disableGutters style={{display:'flex'}}>
          <HomeIcon style={{ fontSize: '2rem' }}/>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              ml: 2,
              display: { xs: 'none', md: 'flex' },
              fontSize: "20px",
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Home
          </Typography>
          <Button 
            variant="contained" 
            onClick={openCreateModal}
            style={{marginLeft: '30rem'}}
            >Create New Post</Button>
        </Toolbar>
      </Container>
      </AppBar>
      {loading ? (
        <Stack spacing={1} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Skeleton variant="text" height={100} width={700}/>
          <Skeleton variant="text" height={20} width={700}/>
          <Skeleton variant="text" height={20} width={700}/>
          <Skeleton variant="rectangular" height={300} width={700}/>
        </Stack>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        {tempPosts.map((post, index) =>{
          return (
            <Post 
              displayName={post.displayName} 
              profileImage={post.profileImage}
              title={post.title}
              contentType={post.contentType}
              content={post.content}
              visibility={post.visibility}
              categories={post.categories}
              count={post.count} 
              />
          )
        })}
        </Box>
      )}
      <CreatePost open={isCreateModalOpen} onClose={closeCreateModal} action='CREATE'/>
    </Box>
  );
}

export default Home;
