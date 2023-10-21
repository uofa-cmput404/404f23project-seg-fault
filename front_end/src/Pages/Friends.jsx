import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import * as bootIcons from "react-icons/bs";
import AuthorTile from '../Components/friends/authorTile';
import useFriendsViewModel from './FriendsViewModel';
import Button from '@mui/material/Button';

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

    return (
        <Box px={{ md: 22 }} sx={{ paddingTop: "10px" }}>
            <AppBar position="static" sx={{ backgroundColor: '#3a86ff' }}>
                <Container maxWidth="md">
                    <Toolbar disableGutters>
                        <bootIcons.BsPeopleFill style={{ fontSize: '1.5rem' }} />
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
                        <Button onClick={() => changeView('authors')} variant="contained" color="primary">Authors</Button>
                        <Button onClick={() => changeView('followers')} variant="contained" color="primary">Followers</Button>
                        <Button onClick={() => changeView('following')} variant="contained" color="primary">Following</Button>
                        <Button onClick={() => changeView('friends')} variant="contained" color="primary">Friends</Button>
                    </Toolbar>
                </Container>
            </AppBar>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                {selectedView === 'authors' && authors.map((author, index) => (
                    <AuthorTile
                        key={index}
                        id={author.id}
                        username={author.displayName}
                        profilePic={author.profileImage}
                        status="follow"
                        authorAction={followAuthor}
                    />
                ))}
                {selectedView === 'followers' && followers.map((author, index) => (
                    <AuthorTile
                        key={index}
                        id={author.follower.id}
                        username={author.follower.displayName}
                        profilePic={author.follower.profileImage}
                        status="follower"
                        authorAction={followAuthor}
                    />
                ))}
                {selectedView === 'following' && following.map((author, index) => (
                    <AuthorTile
                        key={index}
                        id={author.user.id}
                        username={author.user.displayName}
                        profilePic={author.user.profileImage}
                        status="unfollow"
                        authorAction={unfollowAuthor}
                    />
                ))}
                {selectedView === 'friends' && following.map((author, index) => (
                    <AuthorTile
                        key={index}
                        id={author.user.id}
                        username={author.user.displayName}
                        profilePic={author.user.profileImage}
                        status="friend"
                        authorAction={unfollowAuthor}
                    />
                ))}
            </Box>
        </Box>
    );
}

export default Friends;
