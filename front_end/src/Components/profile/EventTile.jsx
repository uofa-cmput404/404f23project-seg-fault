import React from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import * as DiIcons from "react-icons/di";

function EventTile(props) {
  return (
    <Card
      sx={{
        padding: 1,
        margin: 1,
      }}
    >
      <Stack direction="column" spacing={1.5} alignItems="start">
        <Stack direction="row">
          <DiIcons.DiGithubBadge style={{ fontSize: "3rem" }} />
          <Chip
            label={props.type}
            size="small"
            color="success"
            sx={{ marginTop: 1.5, paddingRight: 2 }}
          />
        </Stack>
        <Typography variant="body2">{props.name}</Typography>
      </Stack>
    </Card>
  );
}

export default EventTile;
