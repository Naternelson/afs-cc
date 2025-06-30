import { Prettify } from "../utility/type_helpers";
import { EngineCore } from "./core";
import { Message, MessageQue } from "./message_que";
import World from "./world";

export enum SystemType {
  INPUT,
  OUTBOUND,
  AUTH,
  STANDARD,
}

type InboundSystem = {
  type: SystemType.INPUT;
  callback: (message: Message, engine: EngineCore) => void;
};

type StandardSystem = {
  type: SystemType.AUTH | SystemType.OUTBOUND | SystemType.STANDARD;
  callback: (world: World, engine: EngineCore) => void;
};

export type System = Prettify<InboundSystem | StandardSystem>;
