import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import ButtonBase from '@mui/material/ButtonBase';

import './inboxElement.css'


function InboxElement(props) {
  const visibilityColors = {
    private: '#8338ec',
    friend_request: '#06d6a0',
    like_notification: '#ff006e',
    comment_notification: '#3a86ff',
  };

  const visibilityLabels = {
    private: 'Shared a private post with you!',
    friend_request: 'Wants to be your friend!',
    like_notification: 'Liked your post!',
    comment_notification: 'Commented on your post!',
  };

  const visibilityColor = visibilityColors[props.visibility] || '#000';

  const renderActions = () => {
    if (props.visibility === 'friend_request') {
      return (
        <div className="actionButtons">
          <ButtonBase onClick={handleAccept}>
            <Chip
              label="Accept"
              size="small"
              className='postVisibility'
              sx={{ paddingRight: 2, marginTop: 1.5 }}
              color="primary"
              style={{ backgroundColor: "#8ac926", color: '#fff' }}
            />
          </ButtonBase>
          <ButtonBase onClick={handleDecline}>
            <Chip
              label="Decline"
              size="small"
              className='postVisibility'
              sx={{ paddingRight: 2, marginTop: 1.5 }}
              color="primary"
              style={{ backgroundColor: "#ff595e", color: '#fff' }}
            />
          </ButtonBase>
        </div>
      );
    } 
  
    if (props.visibility === 'like_notification' || props.visibility === 'comment_notification' || props.visibility === 'private') {
      return (
        <div className="actionButtons">
          <ButtonBase onClick={handleView}>
            <Chip
              label="View"
              size="small"
              className='postVisibility'
              sx={{ paddingRight: 2, marginTop: 1.5 }}
              color="primary"
              style={{ backgroundColor: "#1982c4", color: '#fff' }}
            />
          </ButtonBase>
        </div>
      );
    }
  };  

  const handleAccept = () => {
    // Handle accept logic here
  };

  const handleDecline = () => {
    // Handle decline logic here
  };

  const handleView = () => {
    // Handle view logic here
  };

  return (
    <Card className="card">
      <CardHeader
        avatar={
          <Avatar
            src={props.profilePic}
            alt=""
            className="avatar"
          />
        }
        title={props.username}
      />
      <Stack direction="column" spacing={2}>
        <CardActions disableSpacing>
          <Chip
            label={visibilityLabels[props.visibility]}
            size="small"
            className="postVisibility"
            sx={{
              paddingRight: 2,
              fontSize: '16px',
              color: 'white',
              backgroundColor: visibilityColor
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
