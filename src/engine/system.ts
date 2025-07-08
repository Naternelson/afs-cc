import { Prettify } from "../utility/type_helpers";
import { EngineCore } from "./core";
import { Message, MessageQue } from "./message_que";
import World from "./world";

export type EngineSystem = (
  delta: number,
  tick: number,
  engine: EngineCore
) => void;
