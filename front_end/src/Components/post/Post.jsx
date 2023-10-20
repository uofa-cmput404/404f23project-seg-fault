import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SendIcon from '@mui/icons-material/Send';
import CommentIcon from '@mui/icons-material/Comment';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Comment from '../comment/Comment';
import './Post.css'
import PostMenu from '../postMenu/PostMenu';
import Share from '../share/Share';

function isImageUrl(url) {
  return /\.(jpeg|jpg|gif|png|bmp)$/.test(url);
}

function PostDisplay({ content, contentType }) {
  if (contentType === 'text/plain') {
    if (isImageUrl(content)) {
      return (            
        <CardMedia
          component="img"
          image={content}
          alt="postImage"
        />);
    } else {
      return (        
        <Typography className="postText" variant="body2">
        {content}
        </Typography>);
    }

  }  else if (contentType.startsWith('image')) {
      //possibly need to decode images when we connect with other teams add the content type before the image
      return (            
        <CardMedia
          component="img"
          image={content}
          alt="postImage"
        />);

  } else {
    return <p>Unsupported content type: {contentType}</p>;
  }
}

export default function Post(props) {
  const [expandComments, setExpandedComments] = React.useState(false);
  const [liked, setLiked] = React.useState(false)
  const [share, setShare] = React.useState(false)

  const handleLike = () => {
    setLiked((prev) => !prev)
  }

  const handleShare = () => {
    setShare((prev) => !prev)
  }

  const handleExpandClick = () => {
    setExpandedComments(!expandComments);
  };

  const visibilityColors = {
    public: 'info',
    private: 'warning',
    friends: 'success',
  };

  return (
    <>
    <Card sx={{width: 600, padding: 1, margin: 3}}>
      <CardHeader
        avatar={
        <Avatar
            src={props.profileImage}
            alt={""}
            sx={{
              width: 45,
              height: 45
            }}
        />}
        action={
          <PostMenu />
        }
        title={props.displayName}
      />
      <Stack direction="column" spacing={2}>
        <Typography className="title" variant="body2">
               {props.title}
        </Typography>
        <PostDisplay content={props.content} contentType={props.contentType}/>
      </Stack>
      <CardActions disableSpacing>
        <div>
        <IconButton aria-label="like" style={{ color: liked ? 'red' : 'gray' }}  onClick = {handleLike}>
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="comment">
          <CommentIcon onClick={handleExpandClick} />
        </IconButton>
        <IconButton aria-label="share">
          <SendIcon onClick = {handleShare}/>
        </IconButton>
        </div>
        <Chip 
            label={props.visibility} 
            size="small" 
            color={visibilityColors[props.visibility]} 
            className='postVisibility'
            sx={{ paddingRight: 2 }}/> 
      </CardActions>
      <CardActions >
        <Button onClick={handleExpandClick} className="openCommentsButton" size="small">
          {expandComments ? 'Hide Comments' : `View ${props.count} Comments`}
        </Button>
      </CardActions>
      <Collapse in={expandComments} timeout="auto" unmountOnExit>
        <CardContent>
        {/* TODO: pass comments from posts into Comment component */}
          <Comment/>
          <TextField 
            id="outlined-basic" 
            label="new comment" 
            variant="outlined" 
            size="small" 
            fullWidth
          />
        </CardContent>
      </Collapse>
    </Card>
    <Share open={share} onClose={handleShare}/>
    </>
  );
}
