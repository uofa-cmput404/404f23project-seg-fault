import React from 'react';
import { Box, Stack, Skeleton } from "@mui/material";
import Post from '../Components/post/Post';
import { useState } from "react";
import { tempPosts } from './tempPosts';

function Home() {
  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false);
  }, [3000]);

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
    </Box>
  );
}

export default Home;
