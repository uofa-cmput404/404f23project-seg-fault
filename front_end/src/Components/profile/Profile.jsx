import React, { useState } from "react";
import UserCard from "./UserCard";
import { tempPosts } from "../../Pages/tempPosts";
import Post from "../post/Post";
import { Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CreatePost from "../createpost/CreatePost";
import useProfileViewModel from "../../api/ProfileViewModel";

function ProfilePage({ isOwner = true }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const {posts, profileData, followers} = useProfileViewModel();

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
                      name={profileData.displayName} 
                      username={profileData.displayName} 
                      imagePath={profileData.profileImage} />
            <div>
                {tempPosts.map((post, index) => (
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
