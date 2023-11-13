import * as React from "react";
import Box from "@mui/material/Box";
import ProfilePage from "../Components/profile/Profile";

function Profile() {
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
        <ProfilePage isOwner={true} />
      </Box>
    </Box>
  );
}

export default Profile;
