import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import * as bootIcons from "react-icons/bs";
import ProfilePage from '../Components/profile/Profile';

function Profile({user}) {
  return (
    <Box px={{ md: 22 }} sx={{paddingTop: "10px"}}>
    <AppBar position="static" sx={{ backgroundColor: '#3a86ff' }}>
      <Container maxWidth="md">
        <Toolbar disableGutters>
          <bootIcons.BsPersonFill style={{ fontSize: '1.5rem' }}/>
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
            Profile
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <ProfilePage isOwner={true}/>
    </Box>
    </Box>
  );
}

export default Profile;