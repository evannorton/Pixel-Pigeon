/**
 * Stores information about Entity collisions.
 * Setting up collisions is done with {@link SpawnEntityOptions.onOverlap}.
 *
 * @remarks
 * If you set up collisions, the data in this interface is the data of the entity your are colliding with.
 * For example if you set up {@link SpawnEntityOptions.onOverlap | onOverlap} on a player entity,
 * any overlapData you recieve will be the data of entities the player has collided with, but will not include player collision data.
 */
export interface EntityCollidable {
  /**
   * String CollisionLayer that the collided entity is apart of
   */
  collisionLayer: string;
  /**
   * String entityID of the collided entity
   */
  entityID: string;
}
