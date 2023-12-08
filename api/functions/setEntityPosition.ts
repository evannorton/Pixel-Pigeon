import { CollisionData } from "../types/CollisionData";
import { EntityPosition } from "../types/World";
import { getRectangleCollisionData } from "./getRectangleCollisionData";
import { handleCaughtError } from "./handleCaughtError";
import { state } from "../state";

/**
 * Set the specified entity from their current position to a new position
 * @param entityID - String entityID of the entity whos position is being set
 * @param position - New EntityPosition to be set
 */
export const setEntityPosition = (
  entityID: string,
  position: EntityPosition,
): void => {
  if (state.values.world === null) {
    throw new Error(
      `An attempt was made to set entity "${entityID}" position before world was loaded.`,
    );
  }
  for (const level of state.values.world.levels.values()) {
    for (const layer of level.layers) {
      for (const [layerEntityID, entity] of layer.entities) {
        if (layerEntityID === entityID) {
          entity.position = {
            x: position.x,
            y: position.y,
          };
          entity.pathing = null;
          const collisionData: CollisionData = getRectangleCollisionData({
            height: entity.height,
            width: entity.width,
            x: Math.floor(entity.position.x),
            y: Math.floor(entity.position.y),
          });
          if (collisionData.entityCollidables.length > 0 || collisionData.map) {
            if (entity.onCollision !== null) {
              try {
                entity.onCollision(collisionData);
              } catch (error: unknown) {
                handleCaughtError(error, `Entity "${entityID}" onCollision`);
              }
            }
          }
        }
      }
    }
  }
};
