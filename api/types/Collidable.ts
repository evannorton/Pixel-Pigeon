export interface Collidable<CollisionLayer extends string> {
  readonly collisionLayer: CollisionLayer;
  readonly stopMovement?: boolean;
}
