export default class ComponentManager {
  private _components: Map<string, Map<number, any>> = new Map();

  registerComponentType(name: string, namespace?: string) {
    if (namespace) {
        name = `${namespace}.${name}`;
        }
    if (this._components.has(name)) {
      throw new Error(`Component type "${name}" already registered`);
    }
    // Initialize a new Map for this component type
    this._components.set(name, new Map());
  }

  addComponent(entityId: number, name: string, data: any) {
    const map = this._components.get(name);
    if (!map) throw new Error(`Component type "${name}" not registered`);
    map.set(entityId, data);
  }

  getComponent<T>(entityId: number, name: string): T | undefined {
    return this._components.get(name)?.get(entityId);
  }

  removeComponent(entityId: number, name: string) {
    this._components.get(name)?.delete(entityId);
  }

  getEntitiesWithComponent(name: string): number[] {
    return Array.from(this._components.get(name)?.keys() || []);
  }

  getComponentsOfEntity(entityId: number): Record<string, any> {
    const result: Record<string, any> = {};
    for (const [name, map] of this._components.entries()) {
      if (map.has(entityId)) {
        result[name] = map.get(entityId);
      }
    }
    return result;
  }

  removeAllComponentsOfEntity(entityId: number) {
    for (const map of this._components.values()) {
      map.delete(entityId);
    }
  }
}

export type ComponentFieldType = "number" | "string" | "boolean" | "object" | "array" | "any" | ( string & {_componentFieldType: true} );
export interface ComponentSchema {
  name: string;
  fields: {
    [key: string]: {
        type: ComponentFieldType;
        fixed?: boolean; 
        default?: any;
        description?: string;
    };
  };
  namespace?: string;
  description?: string;
  version?: string;
  public?: boolean;
  deprecated?: boolean;
}