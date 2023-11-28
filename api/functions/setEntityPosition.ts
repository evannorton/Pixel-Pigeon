import { CollisionData } from "../types/CollisionData";
import { EntityCollidable } from "../types/EntityCollidable";
import { EntityPosition } from "../types/EntityPosition";
import { Level } from "../types/World";
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
  if (state.values.levelID === null) {
    throw new Error(
      `An attempt was made to set entity "${entityID}" position with no active level.`,
    );
  }
  const level: Level | null =
    state.values.world.levels.get(state.values.levelID) ?? null;
  if (level === null) {
    throw new Error(
      `An attempt was made to set entity "${entityID}" position with a nonexistant active level.`,
    );
  }
  for (const layer of level.layers) {
    for (const [layerEntityID, entity] of layer.entities) {
      if (layerEntityID === entityID) {
        entity.position = {
          x: position.x,
          y: position.y,
        };
        entity.pathing = null;
        const collisionData: CollisionData = getRectangleCollisionData(
          {
            height: entity.height,
            width: entity.width,
            x: Math.floor(entity.position.x),
            y: Math.floor(entity.position.y),
          },
          entity.collidables.map(
            (entityCollidable: EntityCollidable): string =>
              entityCollidable.collisionLayer,
          ),
        );
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
};
