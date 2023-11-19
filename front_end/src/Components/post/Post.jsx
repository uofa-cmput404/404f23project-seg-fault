import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SendIcon from "@mui/icons-material/Send";
import CommentIcon from "@mui/icons-material/Comment";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { useRemark } from "react-remark";
import Comment from "../comment/Comment";
import "./Post.css";
import PostMenu from "../postMenu/PostMenu";
import Share from "../share/Share";
import usePostViewModel from "./PostViewModel";
import { StoreContext } from "../../store";
import { extractIdFromUrl } from "../../api/helper";

function isImageUrl(url) {
  return /\.(jpeg|jpg|gif|png|bmp)$/.test(url);
}

function PostDisplay({ content, contentType }) {
  if (contentType === "text/plain" || contentType === "string") {
    if (isImageUrl(content)) {
      return <CardMedia component="img" image={content} alt="postImage" />;
    } else {
      return (
        <Typography className="postText" variant="body2">
          {content}
        </Typography>
      );
    }
  } else if (contentType.startsWith("image")) {
    // possibly need to decode images when we connect with other teams add the content type before the image
    return <CardMedia component="img" image={content} alt="postImage" />;
  } else if (contentType === "text/markdown") {
    return content;
  } else {
    return <p>Unsupported content type: {contentType}</p>;
  }
}

export default function Post(props) {
  const [markdownContent, setMarkdownContent] = useRemark();
  const { state } = React.useContext(StoreContext);
  const userId = state.user.id;
  const displayName = state.user.username;

  const {
    expandComments,
    liked,
    share,
    likes,
    handleLike,
    handleShare,
    handleExpandClick,
  } = usePostViewModel(props, userId, markdownContent, setMarkdownContent);

  const visibilityColors = {
    public: "info",
    private: "warning",
    friends: "success",
  };

  React.useEffect(() => {
    setMarkdownContent(props.content);
  }, [props.content, setMarkdownContent]);

  return (
    <>
      <Card
        sx={{
          width: props.width,
          padding: props.padding,
          margin: props.margin,
        }}
      >
        <CardHeader
          avatar={
            <Avatar
              src={props.profileImage}
              alt={""}
              sx={{
                width: 45,
                height: 45,
              }}
            />
          }
          action={
            userId === props.userId ? (
              <PostMenu post={props.post} />
            ) : null
          }
          // Wraps the title to a profile link.
          title={
            <Link to={`/profile/${extractIdFromUrl(props.id)}`} style={{ textDecoration: 'none' }}>
              {props.displayName}
            </Link>
          }
        />
        <Stack direction="column" spacing={2}>
          <Typography className="title" variant="body2">
            {props.title}
          </Typography>
          <PostDisplay
            content={
              props.contentType === "text/markdown"
                ? markdownContent
                : props.content
            }
            contentType={props.contentType}
          />
        </Stack>
        <CardActions disableSpacing>
          <div>
            <span>{likes.length}</span>
            <IconButton
              aria-label="like"
              style={{ color: liked ? "red" : "gray" }}
              onClick={handleLike}
            >
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="comment">
              <CommentIcon onClick={handleExpandClick} />
            </IconButton>
            <IconButton aria-label="share">
              <SendIcon onClick={handleShare} />
            </IconButton>
          </div>
          <Chip
            label={props.visibility.toLowerCase()}
            size="small"
            color={visibilityColors[props.visibility.toLowerCase()]}
            className="postVisibility"
            sx={{ paddingRight: 2 }}
          />
        </CardActions>
        <CardActions>
          <Button
            onClick={handleExpandClick}
            className="openCommentsButton"
            size="small"
          >
            {expandComments
              ? "Hide Comments"
              : `View Comments`}
          </Button>
        </CardActions>
        <Collapse in={expandComments} timeout="auto" unmountOnExit>
          <CardContent>
            <Comment
              userId={props.userId}
              postId={props.id}
              displayName={displayName}
            />
          </CardContent>
        </Collapse>
      </Card>
      <Share open={share} onClose={handleShare} post={props.post} />
    </>
  );
}

