import React from "react";
import { Avatar, Button } from "@mui/material";
import {
    InputBase,
  } from "@mui/material";
import './post.css';

function ProfilePostCard({imagePath}) {
    return (
        <div className="main-container">
            <div className="top-container">
                <div className="post-input-container">
                    <div className="avatar-container">
                        <Avatar
                            src={imagePath}
                            alt={""}
                            sx={{
                            width: 45,
                            height: 45
                            }}/>
                    </div>
                    <div className="input-container">
                        <InputBase 
                            placeholder="What's on your mind?" 
                            sx={{
                                width: "100%",
                                borderRadius: "2rem",
                                padding: "2rem",
                                lineHeight: "0.2rem",
                                }}/>
                    </div>
                    <div className="post-button-container">
                        <Button>Post</Button>                           
                    </div>   
                </div>
            </div>
        </div>
    )
}

export default ProfilePostCard