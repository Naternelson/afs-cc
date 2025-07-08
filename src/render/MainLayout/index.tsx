import { Box, CssBaseline } from "@mui/material";
import { grey } from "@mui/material/colors";
import { PropsWithChildren, useEffect, useState } from "react";
import { IPCChannels } from "../../ipc";

export const MainLayout = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    window.ipc.invoke(IPCChannels.DATA_PALLETS).then((d) => {
      console.log("Pallets data received:", d);
    });
  }, []);
  return (
    <>
      <CssBaseline />

      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <ElementsAside />
        <Box sx={{ flexGrow: 1, overflow: "auto", display: "flex" }}>
          {children}
        </Box>
        <Box sx={{ minWidth: "100px", background: "blue" }}>Other Aside</Box>
      </Box>
    </>
  );
};

const ElementsAside = () => {
  const [open, setOpen] = useState(true);
  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "row" }}>
      <Box
        sx={{
          overflow: "hidden",
          height: "100%",
          width: open ? 200 : 0,
          background: grey[200],
          transition: "width .2 ease",
        }}
      >
        <Box sx={{ display: open ? "block" : "none" }}>
          <Box
            sx={{
              border: "1px solid grey",
              borderRadius: "3px",
              margin: "1px",
            }}
          >
            <Box
              sx={{
                padding: "5px",
                color: grey[800],
                fontWeight: "bold",
                fontSize: ".8rem",
                borderBottom: "1px solid grey",
              }}
            >
              Entities
            </Box>
            <Box
              sx={{
                padding: "5px",
                paddingLeft: "20px",
                fontSize: ".7rem",
              }}
            >
              {Array(10)
                .fill(0)
                .map((el, i) => {
                  return (
                    <Box key={i} sx={{ cursor: "pointer", my: 1 }}>
                      Entity: {i}
                    </Box>
                  );
                })}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        onClick={() => {
          setOpen((p) => !p);
        }}
        sx={{
          cursor: "pointer",
          width: 10,
          backgroundColor: grey[400],
          height: "100%",
          "&:hover": {
            backgroundColor: grey[500],
          },
        }}
      ></Box>
    </Box>
  );
};
