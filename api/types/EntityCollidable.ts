export interface EntityCollidable<CollisionLayer extends string> {
  readonly collisionLayer: CollisionLayer;
  readonly entityID: string;
}
