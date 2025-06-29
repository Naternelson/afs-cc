import { Box, CssBaseline } from "@mui/material";
import { PropsWithChildren } from "react";

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <Box>
      <CssBaseline />
      {children}
    </Box>
  );
};
