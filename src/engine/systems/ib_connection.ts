import { ComponentName } from "../../utility";
import { System, SystemType } from "../system";

export const EstablishRendererConn: System = {
  type: SystemType.INPUT,
  callback: (message, engine) => {
    if (message.name !== "connection") return;
    const ent = engine.world.createEntity();
    engine.world.addComponent(ent, ComponentName.RENDERER_CONN, message.owner);
    engine.world.addComponent(ent, ComponentName.TIMESTAMP, performance.now());
  },
};
