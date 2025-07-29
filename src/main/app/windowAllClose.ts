import { app } from "electron";

export const onWindowAllClose = () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
};
