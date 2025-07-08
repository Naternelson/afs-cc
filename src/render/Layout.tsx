import { Box, CssBaseline } from "@mui/material";
import { PropsWithChildren, useEffect } from "react";
import { IPCChannels } from "../ipc";

export const Layout = ({ children }: PropsWithChildren) => {
  
  return (
    <Box>
      <CssBaseline />
      {children}
    </Box>
  );
};
