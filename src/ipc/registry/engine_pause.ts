import { ipcMain } from "electron";
import { IPCChannels } from "../channels";
import AppEngine from "../../main/AppEngine";

ipcMain.handle(IPCChannels.ENGINE_PAUSE, async () => {
  AppEngine.pause();
  return AppEngine.state;
});
