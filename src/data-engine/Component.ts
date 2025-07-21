import { EntityId } from "./types";

export class Component {
  static id?: string;
  onAdd?(entity: EntityId): void;
  onRemove?(entity: EntityId): void;

  clone(): this {
    return Object.assign(Object.create(this.constructor.prototype), this);
  }

  toJSON(): Record<string, any> {
    const jsonObj: Record<string, any> = {};
    for (const key of Object.keys(this)) {
      const value = (this as any)[key];
      if (value !== undefined && typeof value !== "function") {
        jsonObj[key] = value;
      }
    }
    return jsonObj;
  }
  static fromJSON<T extends Component>(
    this: new () => T,
    json: Record<string, any>
  ): T {
    const instance = new this();
    for (const key of Object.keys(json)) {
      (instance as any)[key] = json[key];
    }
    return instance;
  }
}
