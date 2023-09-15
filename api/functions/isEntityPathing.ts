import { Level } from "../types/World";
import { state } from "../state";

export const isEntityPathing = (entityID: string): boolean => {
  if (state.values.world === null) {
    throw new Error(
      `An attempt was made to check pathing of entity "${entityID}" before world was loaded.`,
    );
  }
  if (state.values.levelID === null) {
    throw new Error(
      `An attempt was made to check pathing of entity "${entityID}" with no active level.`,
    );
  }
  const level: Level | null =
    state.values.world.levels.get(state.values.levelID) ?? null;
  if (level === null) {
    throw new Error(
      `An attempt was made to check pathing of entity "${entityID}" with a nonexistant active level.`,
    );
  }
  for (const layer of level.layers) {
    for (const [layerEntityID, entity] of layer.entities) {
      if (layerEntityID === entityID) {
        return entity.path !== null;
      }
    }
  }
  return false;
};
