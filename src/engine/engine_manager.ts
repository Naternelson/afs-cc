import { EngineCore } from "./core";

export class EngineManager {
  private _engineId: number = 1;
  private _engines: Map<number, EngineCore> = new Map();
  createEngine(id?: number): EngineCore {
    if (id) {
      const existing = this._engines.get(id);
      if (existing) {
        return existing;
      }
      this._engineId = id;
      this._engines.set(id, new EngineCore(id));
      return this._engines.get(id);
    }
    this._engineId++;
    const engine = new EngineCore(this._engineId);
    this._engines.set(this._engineId, engine);
    return engine;
  }
  getEngine(id: number): EngineCore | undefined {
    return this._engines.get(id);
  }
  removeEngine(id: number): boolean {
    if (this._engines.has(id)) {
      this._engines.delete(id);
      return true;
    }
    return false;
  }
  getAllEngines(): Map<number, EngineCore> {
    return Array.from(this._engines.values()).reduce((acc, engine) => {
      acc.set(engine.id, engine);
      return acc;
    }, new Map<number, EngineCore>());
  }
  closeAllEngines(): boolean {
    this._engines.clear();
    return true;
  }
}
