export type Message<T = any> = {
  status: "pending" | "consumed" | "rejected";
  name: string;
  data: T;
  owner?: string;
  description?: string;
  id: string;
  timestamp: string;
  error?: Error;
};
type CreateableMessage<T = any> = Omit<
  Message<T>,
  "status" | "id" | "timestamp"
>;

export class MessageQue {
  private _nextId = 1;
  private _messages: Array<Message> = new Array();
  addMessage<T = any>(message: CreateableMessage<T>) {
    const newMessage: Message<T> = {
      ...message,
      id: String(this._nextId),
      timestamp: performance.now().toString(),
      status: "pending",
    };
    this._messages.push(newMessage);
    this._nextId++;
  }
  consumeNextMessage(cb: (message: Message) => void): null | Message {
    const message = this._messages.shift();
    if (!message) return null;
    try {
      cb(message);
      message.status = "consumed";
      return message;
    } catch (error) {
      message.status = "rejected";
      message.error = error;
      return message;
    }
  }
  clear() {
    this._messages = new Array();
    this._nextId = 1;
  }
  get count() {
    return this._messages.length;
  }
}
