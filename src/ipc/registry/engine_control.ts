import { ipcMain } from "electron";
import { IPCChannels } from "../channels";
import AppEngine from "../../main/AppEngine";

ipcMain.handle(IPCChannels.ENGINE_CONTROL, async () => {
  AppEngine.start();
  return AppEngine.state;
});
