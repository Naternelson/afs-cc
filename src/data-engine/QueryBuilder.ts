import { BaseEngine } from "./BaseEngine";
import { ComponentClass, EntityId } from "./types";

export class QueryBuilder<T extends any[]> {
  private engine: BaseEngine;
  private componentTypes: ComponentClass<any>[] = [];
  private excludeTypes: ComponentClass<any>[] = [];
  private filterFn?: (entity: EntityId, components: T) => boolean;
  constructor(engine: BaseEngine, ...componentTypes: ComponentClass<any>[]) {
    this.engine = engine;
    this.componentTypes = componentTypes;
  }
  filter(fn: (entity: number, components: T) => boolean): QueryBuilder<T> {
    this.filterFn = fn;
    return this;
  }

  exclude(...types: ComponentClass<any>[]): QueryBuilder<T> {
    this.excludeTypes.push(...types);
    return this;
  }

  *run(): Generator<[number, ...T]> {
    const maps = this.componentTypes.map((type) => ({
      type,
      map: this.engine.components.getComponentMap(type),
    }));
    maps.sort((a, b) => a.map.size - b.map.size);

    const [base, ...restTypes] = maps;
    for (const [entity, firstComp] of base.map.entries()) {
      const components: any[] = [firstComp];
      let skip = false;
      for (const { map } of restTypes) {
        const comp = map.get(entity);
        if (comp === undefined) {
          skip = true;
          break;
        }
        components.push(comp);
      }
      for (const exType of this.excludeTypes) {
        if (this.engine.components.hasComponent(entity, exType)) {
          skip = true;
          break;
        }
      }

      if (skip) continue;
      if (!this.filterFn || this.filterFn(entity, components as T)) {
        yield [entity, ...(components as T)];
      }
    }
  }
  forEach(fn: (entity: EntityId, ...components: T) => void): void {
    for (const [entity, ...components] of this.run()) {
      fn(entity, ...(components as T));
    }
  }
  toArray(): Array<[EntityId, ...T]> {
    return Array.from(this.run());
  }
}
