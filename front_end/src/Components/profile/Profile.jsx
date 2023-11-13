import React, { useState, useContext } from "react";
import UserCard from "./UserCard";
import Post from "../post/Post";
import { Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CreatePost from "../createpost/CreatePost";
import useProfileViewModel from "../../api/ProfileViewModel";
import { StoreContext } from './../../store';
import { extractIdFromUrl } from "../../api/helper";
import  { Navigate } from 'react-router-dom';

function ProfilePage({userId}) {
    const { state } = useContext(StoreContext);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const {posts, followers, profileData} = useProfileViewModel();

    // Verifies if the owner's id is same as that in the url.
    const isOwner = extractIdFromUrl(state.user.id) === userId;

    const openCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    let likes = 0;
    posts.forEach((post) => likes+=(post.count));

     // Redirect to home page if profile does not exist.
     if (!profileData) {
        return <Navigate to='/home'  />
    }

    return (
        <>
            <UserCard isOwner={isOwner}
                      followersCount={followers.length}
                      postsCount={posts.length} 
                      name={profileData.displayName} 
                      username={profileData.displayName} 
                      github={profileData.github}
                      likesCount={likes}
                      imagePath={profileData.profileImage} />
            <div>
                {posts.map((post, index) => (
                    <Post post={post} />
                ))}
            </div>
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
        </>
    );
}

export default ProfilePage;
