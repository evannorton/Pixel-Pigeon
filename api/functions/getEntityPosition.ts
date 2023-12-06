import { EntityPosition } from "../types/World";
import { state } from "../state";

/**
 *
 * @param entityID - The string entityID of the entity to get the position of
 * @returns The position of the entity if it exists
 */
export const getEntityPosition = (entityID: string): EntityPosition => {
  if (state.values.world === null) {
    throw new Error(
      `An attempt was made to get entity "${entityID}" position before world was loaded.`,
    );
  }
  for (const level of state.values.world.levels.values()) {
    for (const layer of level.layers) {
      for (const [layerEntityID, entity] of layer.entities) {
        if (layerEntityID === entityID) {
          return {
            x: entity.position.x,
            y: entity.position.y,
          };
        }
      }
    }
  }
  throw new Error(
    `An attempt was made to get entity "${entityID}" position for a nonexistant entity.`,
  );
};
