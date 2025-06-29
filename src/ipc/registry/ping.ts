import { ipcMain } from "electron";
import { IPCChannels } from "../channels";

ipcMain.handle(IPCChannels.PING, async () => {
  console.log("Received ping from renderer process");
  return "pong";
});