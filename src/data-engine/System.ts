import { DataEngine } from "./DataEngine";

export abstract class System {
    protected engine: DataEngine; 
    constructor(engine: DataEngine) {
        this.engine = engine;
    }
    abstract onUpdate(dt: number): void;
    onInit?(): void;
    onDestroy?(): void;
}