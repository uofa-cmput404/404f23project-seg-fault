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
import ReactMarkdown from "react-markdown";

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
  } else if (contentType && contentType.startsWith("image")) {
    // possibly need to decode images when we connect with other teams add the content type before the image
    if (content && !content.startsWith("data:image")) {
      return (
        <CardMedia
          component="img"
          image={`data:${contentType},` + content}
          alt="postImage"
        />
      );
    }
    return <CardMedia component="img" image={content} alt="postImage" />;
  } else if (contentType === "text/markdown") {
    return <ReactMarkdown>{content}</ReactMarkdown>;
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
    setMarkdownContent(props.post.content);
  }, [props.post.content, setMarkdownContent]);

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
              src={props.post.author.profileImage}
              alt={""}
              sx={{
                width: 45,
                height: 45,
              }}
            />
          }
          action={
            userId === props.post.author.id ? (
              <PostMenu post={props.post} />
            ) : (
              props.post.author.id &&
              !props.post.author.id.startsWith(
                process.env.REACT_APP_API_URL
              ) && (
                <Chip
                  label="remote"
                  size="small"
                  color="warning"
                  className="postVisibility"
                  sx={{ paddingRight: 2, width: "6rem" }}
                />
              )
            )
          }
          // Wraps the title to a profile link.
          title={
            <Link
              to={`/profile/${extractIdFromUrl(props.post.author.id)}?authorId=${
                props.post.author.id
              }`}
            >
              {props.post.author.displayName}
            </Link>
          }
        />
        <Stack direction="column" spacing={2}>
          <Typography className="title" variant="body2">
            {props.post.title}
          </Typography>
          <PostDisplay
            content={props.post.content}
            contentType={props.post.contentType}
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
            label={props.post.visibility.toLowerCase()}
            size="small"
            color={visibilityColors[props.post.visibility.toLowerCase()]}
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
            {expandComments ? "Hide Comments" : `View Comments`}
          </Button>
        </CardActions>
        <Collapse in={expandComments} timeout="auto" unmountOnExit>
          <CardContent>
            <Comment
              userId={props.post.author.id}
              postId={props.post.id}
              displayName={displayName}
            />
          </CardContent>
        </Collapse>
      </Card>
      <Share open={share} onClose={handleShare} post={props.post} />
    </>
  );
}
