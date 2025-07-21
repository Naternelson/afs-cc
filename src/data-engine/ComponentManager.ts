import { DataEngine } from "./DataEngine";
import { ComponentClass, EntityId } from "./types";

export class ComponentManager {
    engine: DataEngine
    components = new Map<string, Map<number, any>>();
    constructor(engine: DataEngine) {
        this.engine = engine;
    }

    getComponent<T>(entity: number, cls: ComponentClass<T>): T | undefined {
        return this.components.get(getComponentKey(cls))?.get(entity);
    }
    getComponentMap<T>(cls: ComponentClass<T>): Map<EntityId, T> {
        const key = getComponentKey(cls);
        if (!this.components.has(key)) {
            this.components.set(key, new Map());
        }
        return this.components.get(key) as Map<EntityId, T>;
    }
    hasComponent<T>(entity: EntityId, cls: ComponentClass<T>): boolean {
        return this.components.get(getComponentKey(cls))?.has(entity) ?? false;
    }
    addComponent<T>(entity: EntityId, cls: ComponentClass<T>, data?: Partial<T>): T {
        const map = this.getComponentMap(cls);
        const instance: T = new cls(); 
        Object.assign(instance, data);
        map.set(entity, instance);
        if ((instance as any).onAdd) (instance as any).onAdd(entity);
        return instance;
    }
    removeComponent<T>(entity: EntityId, cls: ComponentClass<T>): void {
        const map = this.getComponentMap(cls);
        const instance = map.get(entity);
        if (instance && (instance as any).onRemove) (instance as any).onRemove(entity);
        map.delete(entity);
    }
    removeAll(entity: EntityId): void {
        for (const [key, map] of this.components.entries()) {
            if (map.has(entity)) {
                const instance = map.get(entity);
                if (instance && (instance as any).onRemove) (instance as any).onRemove(entity);
                map.delete(entity);
            }
            if (map.size === 0) {
                this.components.delete(key);
            }
        }
    }
    clear(): void {
        for (const entity of this.engine.entities.getAll()) {
            this.removeAll(entity);
        }
        this.components.clear();
    }
}


function getComponentKey<T>(cls: ComponentClass<T>):string {
    return (cls as any).id || (cls as any).name || "unknown";
}