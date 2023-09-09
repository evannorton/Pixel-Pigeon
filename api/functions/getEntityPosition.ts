import { EntityPosition } from "../types/EntityPosition";
import { Level } from "../types/World";
import { state } from "../state";

/**
 *
 * @param entityID - The string entityID of the entity to get the position of
 * @returns The position of the entity if it exists
 */
export const getEntityPosition = (entityID: string): EntityPosition | null => {
  if (state.values.world === null) {
    throw new Error(
      `An attempt was made to get entity "${entityID}" data before world was loaded.`,
    );
  }
  if (state.values.levelID === null) {
    throw new Error(
      `An attempt was made to get entity "${entityID}" data with no active level.`,
    );
  }
  const level: Level | null =
    state.values.world.levels.get(state.values.levelID) ?? null;
  if (level === null) {
    throw new Error(
      `An attempt was made to get entity "${entityID}" data with a nonexistant active level.`,
    );
  }
  for (const layer of level.layers) {
    for (const [layerEntityID, entity] of layer.entities) {
      if (layerEntityID === entityID) {
        if (entity.position !== null) {
          return {
            x: entity.position.x,
            y: entity.position.y,
          };
        }
        return null;
      }
    }
  }
  throw new Error(
    `An attempt was made to get entity "${entityID}" data for a nonexistant entity.`,
  );
};
