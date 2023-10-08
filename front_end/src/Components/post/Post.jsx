import { Favorite, FavoriteBorder, MoreVert } from "@mui/icons-material";
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  IconButton,
  Typography,
} from "@mui/material";
const Post = () => {
  return (
    <Card sx={{ margin: 4 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "#00bbf9" }} aria-label="recipe">
            J
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVert />
          </IconButton>
        }
        title="Julian"
        subheader="September 14, 2022"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          This is a placeholder post taken from the video. It will have to be repalced with our component.
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <Checkbox
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite sx={{ color: "red" }} />}
          />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default Post;