import React from "react";
import UserCard from "./UserCard";
import { tempPosts } from "../../Pages/tempPosts";
import Post from "../post/Post";
import { Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CreatePost from "../createpost/CreatePost";

function ProfilePage({isOwner = true}) {

    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
    
    const openCreateModal = () => {
        setIsCreateModalOpen(true);
    };
    
    const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    };

    return (
        <>
            <UserCard isOwner = {isOwner} />
            <div>
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
            </div>
            <Fab 
                color="primary" 
                aria-label="add"
                style={{position: 'fixed', top: '20rem', right: '5rem'}}
                onClick={openCreateModal}>
            <AddIcon />
      </Fab>
      <CreatePost open={isCreateModalOpen} onClose={closeCreateModal} action='CREATE'/>
    </>
    );
}

export default ProfilePage;