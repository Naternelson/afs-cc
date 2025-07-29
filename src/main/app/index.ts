import { app } from "electron";
import { onReady } from "./ready";
import { onWindowAllClose } from "./windowAllClose";
import { onActivate } from "./activate";

if (require("electron-squirrel-startup")) {
  app.quit();
}
app.on("ready", onReady);
app.on("window-all-closed", onWindowAllClose);
app.on("activate", onActivate);
