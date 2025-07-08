import "./style";
import { Box, BoxProps } from "@mui/material";
import { RefObject, useEffect, useRef, useState } from "react";
import { IPCChannels } from "../../../ipc";
import * as Three from "three";
export const Renderer = ({
  containerProps,
  engineId,
}: {
  containerProps?: BoxProps;
  engineId?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [eId, setEngineId] = useState<number | undefined>(engineId);
  useEffect(() => {
    if (!ref.current) return;
    return effect(ref);
  }, []);

  useEffect(() => {
    if (!eId) {
      window.ipc.invoke(IPCChannels.ENGINE_INIT, eId).then((id) => {
        setEngineId(id);
      });
      return;
    }
    window.ipc.on(`engine:update:${eId}`, (event, data) => {
      console.log("Renderer update received for engine:", eId, data);
    });
    return () => {
      window.ipc.removeAllListeners(`engine:update:${eId}`);
    };
  }, [eId]);

  return (
    <>
      <Box
        ref={ref}
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          outline: "1px solid red",
          overflow: "hidden",
          outlineOffset: -2,
          ...containerProps,
        }}
      ></Box>
    </>
  );
};

const effect = (ref: RefObject<HTMLDivElement>) => {
  if (!ref.current) return;
  const renderer = new Three.WebGLRenderer();
  const resize = () => {
    if (!ref.current) return;
    const { width, height } = ref.current.getBoundingClientRect();
    renderer.setSize(width, height);
    return { width, height };
  };

  const observer = new ResizeObserver((entries) => {
    const { target } = entries[0];
    const { width, height } = target.getBoundingClientRect();
    renderer.setSize(width, height);
  });
  observer.observe(ref.current);

  const { width, height } = resize();
  const ratio = width / height;
  ref.current.appendChild(renderer.domElement);

  const camera = new Three.PerspectiveCamera(75, ratio, 0.1, 1000);
  const scene = new Three.Scene();

  const animate = () => {
    renderer.render(scene, camera);
  };

  renderer.setAnimationLoop(animate);

  return () => {
    scene.clear();
    camera.clear();
    renderer.clear();
    observer.disconnect();
  };
};

const ControlPanel = () => {
  <Box sx={{ position: "absolute", top: 0, left: 0, zIndex: 1000, minHeight: 100, display: "flex" }}>
    
  </Box>;
};
