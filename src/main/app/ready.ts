import { engine } from "../engine/singleton";
import { generateMainWindow } from "../windows";

export const onReady = () => {
  generateMainWindow();
  engine.start(1);
};
