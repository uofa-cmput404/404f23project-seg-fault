import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import {tempComments} from './tempComments';

const style = {
  width: '100%',
  bgcolor: 'background.paper',
};

export default function Comment() {
  return (
    <List sx={style} component="nav" aria-label="mailbox folders">
      <Divider/>
      {tempComments.map((comment, index) => {
        return (
          <>
          <ListItem >
          <ListItemText 
            primary={comment.name}
            secondary={comment.text}
            primaryTypographyProps={{ style: {fontWeight: 'bold', fontSize: '12px'} }}
            secondaryTypographyProps={{ style: { fontSize: '12px'} }}/>
          </ListItem>
          <Divider/>
          </>
        );
      })}
    </List>
  );
}