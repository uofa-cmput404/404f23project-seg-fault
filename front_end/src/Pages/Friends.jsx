import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import * as bootIcons from "react-icons/bs";
import AuthorTile from '../Components/friends/authorTile';
import useFriendsViewModel from './FriendsViewModel';

function Friends() {
  const {
    authors,
    followAuthor,
  } = useFriendsViewModel();

  return (
    <Box px={{ md: 22 }} sx={{paddingTop: "10px"}}>
      <AppBar position="static" sx={{ backgroundColor: '#3a86ff' }}>
        <Container maxWidth="md">
          <Toolbar disableGutters>
            <bootIcons.BsPeopleFill style={{ fontSize: '1.5rem' }}/>
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
              Friends
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        {authors.map((author, index) => (
          <AuthorTile
            key={index}
            id={author.id}
            username={author.displayName}
            profilePic={author.profileImage}
            status="followable"
            authorAction={followAuthor}
          />
        ))}
      </Box>
    </Box>
  );
}

export default Friends;
