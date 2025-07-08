export type ComponentFieldType =
  | "number"
  | "string"
  | "boolean"
  | "object"
  | "array"
  | "any"
  | (string & { _componentFieldType: true });
export type ComponentSchema = {
  name: string;
  fields: Record<string, ComponentFieldType>;
};
export type EntityId = number;

export default class World {
  private _nextEntityId: number = 1;
  private _entities: Set<number> = new Set();
  private _components: Map<string, Map<number, any>> = new Map();
  private _schemas: Map<string, ComponentSchema> = new Map();
  private _stagedChanges: Array<{
    entity: EntityId;
    component?: string;
    data?: any;
    deleteComponent?: boolean;
    deleteEntity?: boolean;
  }> = [];

  createEntity(): EntityId {
    const entityId = this._nextEntityId++;
    this._entities.add(entityId);
    return entityId;
  }
  destroyEntity(entityId: EntityId): void {
    if (this._entities.has(entityId)) {
      this._entities.delete(entityId);
      this.removeAllComponentsOfEntity(entityId);
    }
  }
  hasEntity(entityId: EntityId): boolean {
    return this._entities.has(entityId);
  }
  getEntities(): Set<EntityId> {
    return new Set(this._entities);
  }
  serialize() {
    return {
      entities: Array.from(this._entities),
      components: Array.from(this._components.entries()).map(([name, map]) => ({
        name,
        data: Array.from(map.entries()),
      })),
      schemas: Array.from(this._schemas.values()),
    };
  }
  serializeEntitiesObject(): Record<EntityId, Record<string, any>> {
    const result: Record<EntityId, Record<string, any>> = {};

    for (const entityId of this._entities) {
      const entityComponents: Record<string, any> = {};
      for (const [name, map] of this._components.entries()) {
        if (map.has(entityId)) {
          entityComponents[name] = map.get(entityId);
        }
      }
      result[entityId] = entityComponents;
    }

    return result;
  }
  resolveChanges() {
    const changes = this._stagedChanges;
    for (const change of changes) {
      if (change.deleteComponent) {
        this.removeAllComponentsOfEntity(change.entity);
      } else if (change.component && change.data !== undefined) {
        this.addComponent(change.entity, change.component, change.data);
      } else if (change.component && change.data === undefined) {
        const map = this._components.get(change.component);
        if (map) {
          map.delete(change.entity);
        }
      }
    }
    this._stagedChanges = [];
  }
  clearEntities(): void {
    this._entities.clear();
    this._nextEntityId = 1;
    this._components.clear();
  }
  registerComponent(schema: ComponentSchema): void {
    const { name } = schema;
    if (this._schemas.has(name)) {
      throw new Error(`Component type "${name}" already registered`);
    }
    this._schemas.set(name, schema);
    this._components.set(name, new Map());
  }
  removeAllComponentsOfEntity(entityId: EntityId): void {
    for (const map of this._components.values()) {
      map.delete(entityId);
    }
  }
  addComponent(entityId: EntityId, name: string, data: any): void {
    if (!this._schemas.has(name)) {
      throw new Error(`Component type "${name}" not registered`);
    }
    const map = this._components.get(name);
    if (!map) throw new Error(`Component type "${name}" not registered`);
    map.set(entityId, data);
  }
  getEntityComponents(entityId: EntityId): Record<string, any> {
    const result: Record<string, any> = {};
    for (const [name, map] of this._components.entries()) {
      if (map.has(entityId)) {
        result[name] = map.get(entityId);
      }
    }
    return result;
  }
  query(required: string[], optional: string[] = []): EntityId[] {
    const result: EntityId[] = [];
    for (const entityId of this._entities) {
      const components = this.getEntityComponents(entityId);
      if (required.every((name) => name in components)) {
        if (optional.every((name) => name in components)) {
          result.push(entityId);
        }
      }
    }
    return result;
  }
}
