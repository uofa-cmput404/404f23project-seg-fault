import React from "react";
import UserCard from "./widgets/UserCard";
import { tempPosts } from "../../../Pages/tempPosts";
import Post from "../../post/Post";

function AnotherUserProfile() {
    return (
        <>
            <UserCard/>
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
        </>
    );
}

export default AnotherUserProfile;