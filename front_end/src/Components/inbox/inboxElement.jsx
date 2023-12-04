import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import ButtonBase from "@mui/material/ButtonBase";

import "./inboxElement.css";
import useFriendsViewModel from "../../Pages/FriendsViewModel";

function InboxElement(props) {
  const { acceptFollowRequest } = useFriendsViewModel();
  const [isVisible, setIsVisible] = useState(true); // State to control visibility

  const visibilityColors = {
    post: "#8338ec",
    follow: "#06d6a0",
    Like: "#ff006e",
    comment: "#3a86ff",
  };

  const visibilityLabels = {
    post: "Shared a post to you!",
    follow: "Wants to be your friend!",
    Like: "Liked your post!",
    comment: "Commented on your post!",
  };

  const visibilityColor = visibilityColors[props.visibility] || "#000";

  const handleAccept = () => {
    acceptFollowRequest(props.inboxData);
    setIsVisible(false);
  };

  const renderActions = () => {
    if (props.visibility === "follow") {
      return (
        <div className="actionButtons">
          <ButtonBase onClick={handleAccept}>
            <Chip
              label={"Accept"}
              size="small"
              sx={{ paddingRight: 2, marginTop: 1.5 }}
              style={{ backgroundColor: "#8ac926", color: "#fff" }}
            />
          </ButtonBase>
        </div>
      );
    }
  };

  if (!isVisible) {
    return null;
  }
  console.log(props);
  return (

    <Card className="card" style={{ width: "60vw" }}>
      <CardHeader
        avatar={
          <Avatar src={props.profilePic} alt="profile_pic" className="avatar" />
        }
        title={props.username}
      />
      <Stack direction="column" spacing={2}>
        <CardActions disableSpacing>
          <Chip
            label={visibilityLabels[props.visibility]}
            size="small"
            sx={{
              paddingRight: 2,
              fontSize: "16px",
              color: "white",
              backgroundColor: visibilityColor,
            }}
          />
        </CardActions>
        <Typography className="elementText" variant="body2">
          {props.text}
        </Typography>
        {renderActions()}
      </Stack>
    </Card>
  );
}

export default InboxElement;
