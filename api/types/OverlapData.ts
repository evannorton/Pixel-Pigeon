import { EntityCollidable } from "pigeon-mode-game-framework/api/types/EntityCollidable";

/**
 * Data provided from {@link SpawnEntityOptions.onOverlap}. Has a list of collisions and whether or not they exist on the world map.
 * @example
 * ```ts
 *  if (overlapData.entityCollidables.length > 0) { // Ensure there is at least one entity that was collided with
    const entityCollidable: EntityCollidable<CollisionLayer> = overlapData.entityCollidables[0]; // Get the first collided entity
    if (enemyID == entityCollidable.entityID) { // enemyID would be the entityID of an pre-defined enemy
      console.log("The player collided with an enemy!");
    }
  }
 * ```
*/
export interface OverlapData<CollisionLayer extends string> {
  /**
   * Array of entites the entity with {@link SpawnEntityOptions.onOverlap | onOverlap} collided with
   */
  readonly entityCollidables: EntityCollidable<CollisionLayer>[];
  /**
   * Does the collision take place on the world map?
   */
  readonly map: boolean;
}
