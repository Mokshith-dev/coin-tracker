import { Box, CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <Box sx={{ display: "flex", height: "350px", alignItems: "center" }}>
      <CircularProgress />
    </Box>
  );
}
