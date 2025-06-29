import "./style";
import { Box, BoxProps } from "@mui/material";
import { RefObject, useEffect, useRef } from "react";
import * as Three from "three";
export const Renderer = ({ containerProps }: { containerProps?: BoxProps }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    return effect(ref);
  }, []);
  return (
    <Box
      ref={ref}
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        outline: "1px solid red",
        outlineOffset: -2,
        ...containerProps,
      }}
    />
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
    const { width, height } = resize();
    console.log({ width, height });
    renderer.setSize(width, height);
    renderer.render(scene, camera);
  };

  renderer.setAnimationLoop(animate);
  //   const obs = new ResizeObserver(resize);
  //   obs.observe(ref.current);

  window.addEventListener("resize", resize);

  return () => {
    scene.clear();
    camera.clear();
    renderer.clear();
    observer.disconnect();
    window.removeEventListener("reisze", resize);
  };
};
