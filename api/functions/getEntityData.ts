import { Level } from "../types/World";
import { state } from "../state";

export interface EntityData {
  readonly x: number;
  readonly y: number;
}
export const getEntityData = (entityID: string): EntityData => {
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
        return {
          x: entity.x,
          y: entity.y,
        };
      }
    }
  }
  throw new Error(
    `An attempt was made to get entity "${entityID}" data for a nonexistant entity.`,
  );
};
