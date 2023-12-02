import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import { Chip, Link } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import ButtonBase from "@mui/material/ButtonBase";
import { Link as RouterLink } from "react-router-dom";
import { extractIdFromUrl } from "../../api/helper";

function AuthorTile(props) {
  const chipLabels = {
    follow: "Follow",
    unfollow: "Unfollow",
    follower: "Following you",
    friend: "Remove friend",
    share: "Share",
  };

  const chipColors = {
    follow: "#3a86ff",
    unfollow: "#e63946",
    follower: "#8338ec",
    friend: "#e63946",
    share: "#3a86ff",
  };

  var chipLabel = chipLabels[props.status];

  if (props.authorStatus && props.authorStatus.id === props.id) {
    chipLabel = chipLabels[props.authorStatus.status];
  }

  var chipColor = chipColors[props.status] || "#000";

  if (props.authorStatus && props.authorStatus.id === props.id) {
    chipColor = chipColors[props.authorStatus.status];
  }

  const handleClick = () => {
    props.authorAction(props.id);
  };

  const myStyle = {
    width: props.status === "share" ? '30vw' : '60vw',
    // Add other style properties as needed
  };

  return (
    <Card className="card" style={myStyle}>
      <CardHeader
        avatar={
          <Avatar src={props.profilePic} alt="profile_pic" className="avatar" />
        }
        title={
          <Link
            component={RouterLink}
            to={`/profile/${extractIdFromUrl(props.id)}`}
            style={{ textDecoration: "none" }}
          >
            {props.username}
          </Link>
        }
        action={
          <>
            <ButtonBase onClick={handleClick}>
              <Chip
                label={chipLabel}
                size="small"
                sx={{ paddingRight: 2, marginTop: 1.5 }}
                style={{ backgroundColor: chipColor, color: "#fff" }}
              />
            </ButtonBase>
            {props.remoteAuthor && (
              <Chip
                label="Remote"
                size="small"
                sx={{ paddingRight: 2, marginTop: 1.5 }}
                style={{ backgroundColor: "#ffad3d", color: "#fff" }}
              />
            )}
          </>
        }
      />
    </Card>
  );
}

export default AuthorTile;
