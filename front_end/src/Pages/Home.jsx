import React from "react";
import { Box, Stack, Skeleton } from "@mui/material";
import Post from "../Components/post/Post";
import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CreatePost from "../Components/createpost/CreatePost";
import HomeIcon from "@mui/icons-material/Home";
import Button from "@mui/material/Button";
import usePostsViewModel from "../api/PostsViewModel";
import useRemotePostsViewModel from "../api/RemotePostsViewModel";

function Home() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { loading, posts} = usePostsViewModel();
  const { loadingRemotePosts, remotePosts} = useRemotePostsViewModel();

  console.log(remotePosts);

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <Box px={{ md: 22 }} sx={{ paddingTop: "10px" }}>
      <AppBar position="static" sx={{ backgroundColor: "#3a86ff" }}>
        <Container maxWidth="md">
          <Toolbar disableGutters style={{ display: "flex" }}>
            <HomeIcon style={{ fontSize: "2rem" }} />
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
              Home
            </Typography>
            <Button
              variant="contained"
              onClick={openCreateModal}
              style={{ marginLeft: "30rem" }}
            >
              New Post
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
      {(loading || loadingRemotePosts)? (
        <Stack
          spacing={1}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Skeleton variant="text" height={100} width={700} />
          <Skeleton variant="text" height={20} width={700} />
          <Skeleton variant="text" height={20} width={700} />
          <Skeleton variant="rectangular" height={300} width={700} />
        </Stack>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {posts.map((post, index) => {
            return <Post 
              post={post}
              content={post.content}
              profileImage={post.author.profileImage}
              userId={post.author.id}
              displayName={post.author.displayName}
              title={post.title}
              contentType={post.contentType}
              visibility={post.visibility}
              id={post.id}
              width={600} 
              padding={1} 
              margin={1} 
              type={"local"}/>;
          })}
          {remotePosts.map((post, index) => {
            return <Post 
              post={remotePosts} 
              content={post.content}
              profileImage={post.owner.image}
              userId={post.owner.id}
              displayName={post.owner.username}
              title={post.title}
              contentType={post.contentType}
              visibility={post.visibility}
              id={post.id}
              width={600} 
              padding={1} 
              margin={1} 
              type={"remoteGroup1"}/>;
          })}
        </Box>
      )}
      <CreatePost
        open={isCreateModalOpen}
        onClose={closeCreateModal}
        action="CREATE"
      />
    </Box>
  );
}

export default Home;
