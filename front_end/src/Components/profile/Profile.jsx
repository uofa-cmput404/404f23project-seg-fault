import React, { useState, useContext } from "react";
import UserCard from "./UserCard";
import Post from "../post/Post";
import { Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CreatePost from "../createpost/CreatePost";
import useProfileViewModel from "../../api/ProfileViewModel";
import { StoreContext } from './../../store';


function ProfilePage({ isOwner = true }) {
    const { state } = useContext(StoreContext);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const {posts, followers} = useProfileViewModel();

    const openCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    return (
        <>
            <UserCard isOwner={isOwner}
                      followersCount={followers.length}
                      postsCount={posts.length} 
                      name={state.user.username} 
                      username={state.user.username} 
                      github={state.user.github}
                      imagePath={state.user.profileImage} />
            <div>
                {posts.map((post, index) => (
                    <Post
                    post={post}
                    />
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
