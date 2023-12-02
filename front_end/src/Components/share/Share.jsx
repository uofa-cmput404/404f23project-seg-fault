import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import './Share.css'
import AuthorTile from '../friends/authorTile';
import { Typography } from '@mui/material';
import useShareViewModel from "./ShareViewModel";

export default function Share(props) {
  const {
    followers,
    sharePost
  } = useShareViewModel();

  const handleShare = (authorId) => {
    sharePost(props.post, authorId)
    props.onClose()
  }

  return (
    <div>
      <Modal
        open={props.open}
        onClose={()=>{
          props.onClose()}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style = {{overflowY: 'auto'}}
      >
        <Box className="share-box">
            <Typography variant="h6" color="gray">
                Share this post with a friend:
            </Typography>
            <Box 
            sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center'}}
            >
            {followers.map((author, index) => (
              <AuthorTile
              key={index}
              id={author.items[0].id}
              username={author.items[0].displayName}
              profilePic={author.items[0].profileImage}
              remoteAuthor={author.remote}
              status="share"
              authorAction={handleShare}
            />
            ))}
            </Box>
        </Box>
      </Modal>
    </div>
  );
}
