export default class EntityManager {
    _nextEntityId: number = 1;
    _entitities: Set<number> = new Set();
    createEntity(): number {
        const entityId = this._nextEntityId++;
        this._entitities.add(entityId);
        return entityId;
    }
    destroyEntity(entityId: number): void {
        if (this._entitities.has(entityId)) {
            this._entitities.delete(entityId);
        }
    }
    hasEntity(entityId: number): boolean {
        return this._entitities.has(entityId);
    }
    getEntities(): Set<number> {
        return new Set(this._entitities);
    }
    clearEntities(): void {
        this._entitities.clear();
        this._nextEntityId = 1;
    }
}