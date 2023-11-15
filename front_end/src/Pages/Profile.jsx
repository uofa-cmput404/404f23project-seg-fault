import * as React from "react";
import Box from "@mui/material/Box";
import ProfilePage from "../Components/profile/Profile";
import { useParams } from 'react-router-dom';

function Profile() {
  const { userId } = useParams();
  return (
    <Box px={{ md: 22 }} sx={{ paddingTop: "10px" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ProfilePage userId = {userId} />
      </Box>
    </Box>
  );
}

export default Profile;
