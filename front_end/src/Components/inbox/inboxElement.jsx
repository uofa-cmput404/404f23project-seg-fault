import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import ButtonBase from "@mui/material/ButtonBase";

import "./inboxElement.css";

function InboxElement(props) {
  const visibilityColors = {
    post: "#8338ec",
    friend_request: "#06d6a0",
    like_notification: "#ff006e",
    comment: "#3a86ff",
  };

  const visibilityLabels = {
    post: "Shared a private post with you!",
    friend_request: "Wants to be your friend!",
    like_notification: "Liked your post!",
    comment: "Commented on your post!",
  };

  const visibilityColor = visibilityColors[props.visibility] || "#000";

  const handleAccept = () => {};

  const handleDecline = () => {};

  const renderActions = () => {
    if (props.visibility === "friend_request") {
      return (
        <div className="actionButtons">
          <ButtonBase onClick={handleAccept}>
            <Chip
              label="Accept"
              size="small"
              sx={{ paddingRight: 2, marginTop: 1.5 }}
              style={{ backgroundColor: "#8ac926", color: "#fff" }}
            />
          </ButtonBase>
          <ButtonBase onClick={handleDecline}>
            <Chip
              label="Decline"
              size="small"
              sx={{ paddingRight: 2, marginTop: 1.5 }}
              style={{ backgroundColor: "#ff595e", color: "#fff" }}
            />
          </ButtonBase>
        </div>
      );
    }
  };

  return (
    <Card className="card">
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
