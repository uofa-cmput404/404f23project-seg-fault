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

  const chipColor = chipColors[props.status] || "#000";

  const handleClick = () => {
    props.authorAction(props.id);
  };

  return (
    <Card className="card">
      <CardHeader
        avatar={
          <Avatar src={props.profilePic} alt="profile_pic" className="avatar" />
        }
        title={
          // Wrap the title in a Link component
          <Link
            component={RouterLink}
            to={`/profile/${extractIdFromUrl(props.id)}`}
            style={{ textDecoration: 'none' }}
          >
            {props.username}
          </Link>
        }
        action={
          <ButtonBase onClick={handleClick}>
            <Chip
              label={chipLabels[props.status]}
              size="small"
              sx={{ paddingRight: 2, marginTop: 1.5 }}
              style={{ backgroundColor: chipColor, color: "#fff" }}
            />
          </ButtonBase>
        }
      />
    </Card>
  );
}

export default AuthorTile;
