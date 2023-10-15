import * as React from 'react';
import { Box } from "@mui/material";

const UserImage = ({ imagePath }) => {
    const size = "45px";
    return (
    <Box width={size} height={size}>
        <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt=""
        src={imagePath}
        />
    </Box>
    );
};

export default UserImage;