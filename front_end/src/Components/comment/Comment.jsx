import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useCommentsViewModel } from "./CommentsViewModel";

const style = {
  width: "100%",
  bgcolor: "background.paper",
};

export default function Comment(props) {
  const { comments, newComment, setNewComment, createComment } =
      useCommentsViewModel(props.postId);

  return (
      <List sx={style} component="nav" aria-label="mailbox folders">
        {comments.map((comment, index) => {
          return (
              <div key={index}>
                <Divider />
                <ListItem>
                  <ListItemText
                      primary={comment.comment}
                      secondary={comment.published}
                      primaryTypographyProps={{
                        style: { fontWeight: "bold", fontSize: "12px" },
                      }}
                      secondaryTypographyProps={{ style: { fontSize: "12px" } }}
                  />
                </ListItem>
                <Divider />
              </div>
          );
        })}
        <TextField
            id="outlined-basic"
            label="New comment"
            variant="outlined"
            size="small"
            fullWidth
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
        />
        <Button
            variant="contained"
            onClick={createComment}
            sx={{ marginTop: "6px" }}
        >
          Submit
        </Button>
      </List>
  );
}