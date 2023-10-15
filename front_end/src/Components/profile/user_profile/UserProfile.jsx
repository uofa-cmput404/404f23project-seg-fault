import * as React from 'react';
import Post from './widgets/Post';
import testImage from '../../../Images/profile.png';
import "./userprofile.css";
import UserInfoCard from './widgets/UserInfoCard';

function Profile({imagePath=testImage, userName="Selena"}) {
    return (
        <div className="main-profile-div">
            <div className="profile-container">
               <div className="top-section">
                    <div className="user-profile-bg-image">
                        <img
                            alt=""
                            id="pr-bg-img" 
                            src="https://wallpaperaccess.com/full/170249.jpg"
                        />
                    </div>
                    <div className="user-profile-image">
                        <img
                                alt=""
                                src={imagePath}
                                id="pr-img"
                        />
                    </div>
                    <div className="user-name">
                        {userName}
                    </div>
                </div>
                <div className="bottom-section">
                    <div className="left-side">
                        <Post imagePath={imagePath} />
                    </div>

                    <div className="right-side">
                        <UserInfoCard/>
                    </div>
                </div> 
            </div>
        </div>
    )
}

export default Profile;