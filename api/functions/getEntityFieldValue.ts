import { Level } from "../types/World";
import { state } from "../state";

export const getEntityFieldValue = (
  entityID: string,
  fieldID: string,
): unknown => {
  if (state.values.world === null) {
    throw new Error(
      `An attempt was made to get entity "${entityID}" field value "${fieldID}" before world was loaded.`,
    );
  }
  if (state.values.levelID === null) {
    throw new Error(
      `An attempt was made to get entity "${entityID}" field value "${fieldID}" with no active level.`,
    );
  }
  const level: Level | null =
    state.values.world.levels.get(state.values.levelID) ?? null;
  if (level === null) {
    throw new Error(
      `An attempt was made to get entity "${entityID}" field value "${fieldID}" with a nonexistant active level.`,
    );
  }
  for (const layer of level.layers) {
    for (const [layerEntityID, entity] of layer.entities) {
      if (layerEntityID === entityID) {
        return entity.fieldValues.get(fieldID) ?? null;
      }
    }
  }
  throw new Error(
    `An attempt was made to get entity "${entityID}" field value "${fieldID}" for a nonexistant entity.`,
  );
};
