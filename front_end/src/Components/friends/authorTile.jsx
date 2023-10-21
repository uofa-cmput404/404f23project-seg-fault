import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { Chip } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import ButtonBase from '@mui/material/ButtonBase';

function AuthorTile(props) {

    const chipLabels = {
        follow: 'Follow',
        unfollow: 'Unfollow',
        follower: 'Following you!',
        friend: 'Friends',
    };

    const chipColors = {
        follow: '#3a86ff',
        unfollow: '#3a86ff',
        follower: '#3a86ff',
        friend: '#8338ec',
    };

    const chipColor = chipColors[props.status] || '#000';

  const handleClick = () => {
    props.authorAction(props.id);
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
        action={
          <ButtonBase onClick={handleClick}>
            <Chip
              label={chipLabels[props.status]}
              size="small"
              className='postVisibility'
              sx={{ paddingRight: 2, marginTop: 1.5 }}
              color="primary"
              style={{ backgroundColor: chipColor, color: '#fff' }}
            />
          </ButtonBase>
        }
      />
    </Card>
  );
}

export default AuthorTile;
