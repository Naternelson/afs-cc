// index.ts (the main entry point)
import { watchDirectory } from "./watcher";
import { FileWatchConfigType } from "./types";
import config from "../config/file_watch_config.json";
import { WebContents } from "electron";

export const watchAllFiles = async (webContents: WebContents) => {
  const watchers = (config.watch as FileWatchConfigType[]).map((watchConfig) =>
    watchDirectory(watchConfig, (parsedResult) => {
      webContents.send(`sym:${watchConfig.type}:file-created`, parsedResult);
    })
  );

  return () => {
    watchers.forEach((stop) => stop());
  };
};
