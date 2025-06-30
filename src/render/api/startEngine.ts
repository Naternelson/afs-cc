import { IPCChannels } from "../../ipc";

export const ping = async (cb: (result: any) => void) => {
  const result = await window.ipc.invoke(IPCChannels.PING);
  cb(result);
};
