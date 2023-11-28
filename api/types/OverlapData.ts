import { EntityCollidable } from "./EntityCollidable";

/**
 * Data provided from {@link SpawnEntityOptions.onOverlap}. Has a list of collisions and whether or not they exist on the world map.
 * @example
 * ```ts
 *  if (overlapData.entityCollidables.length > 0) { // Ensure there is at least one entity that was collided with
    const entityCollidable: EntityCollidable = overlapData.entityCollidables[0]; // Get the first collided entity
    if (enemyID == entityCollidable.entityID) { // enemyID would be the entityID of an pre-defined enemy
      console.log("The player collided with an enemy!");
    }
  }
 * ```
*/
export interface OverlapData {
  /**
   * Array of entites the entity with {@link SpawnEntityOptions.onOverlap | onOverlap} collided with
   */
  entityCollidables: EntityCollidable[];
  /**
   * Does the collision take place on the world map?
   */
  map: boolean;
}
