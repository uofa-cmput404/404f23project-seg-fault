import { Box } from "@mui/material";
import { styled } from "@mui/system";

const WidgetWrapper = styled(Box)( () => ({
  padding: "1.5rem 1.5rem 0.75rem 1.5rem",
  borderRadius: "0.75rem",
  backgroundColor: "#00353F",
  width: "1000px", // Increase the width
  height: "150px", // Increase the height
}));

export default WidgetWrapper;