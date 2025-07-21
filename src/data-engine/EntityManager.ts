import { DataEngine } from "./DataEngine";
import { EntityId } from "./types";

export class EntityManager {
    private entities: Set<number> = new Set();
    private nextId:EntityId = 1;
    public engine: DataEngine;
    constructor(engine: DataEngine) {
        this.engine = engine;
    }
    create(): number {
        const id = this.nextId++;
        this.entities.add(id);
        return id;
    }
    destroy(id: number): void {
        this.entities.delete(id);
    }
    has(id: number): boolean {
        return this.entities.has(id);
    }
    getAll(): number[] {
        return Array.from(this.entities);
    }
    clear(): void {
        this.entities.clear();
        this.nextId = 1;
    }
    count(): number {
        return this.entities.size;
    }
    isEmpty(): boolean {
        return this.entities.size === 0;
    }
    
}