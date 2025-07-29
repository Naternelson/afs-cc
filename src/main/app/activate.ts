import { BrowserWindow } from "electron";
import { generateMainWindow } from "../windows";

export const onActivate = () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    generateMainWindow();
  }
};
