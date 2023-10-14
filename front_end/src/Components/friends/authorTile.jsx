import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { Chip } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import ButtonBase from '@mui/material/ButtonBase';

function AuthorTile(props) {

  const chipLabels = {
    friends: 'Friends',
    followable: 'Follow',
    pending: 'Following',
  };

  const chipColors = {
    friends: '#8338ec',
    followable: '#3a86ff',
    pending: '#ff006e',
  };

  const chipColor = chipColors[props.status] || '#000';

  const handleClick = () => {
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
