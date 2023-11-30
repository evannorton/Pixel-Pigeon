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
  for (const level of state.values.world.levels.values()) {
    for (const layer of level.layers) {
      for (const [layerEntityID, entity] of layer.entities) {
        if (layerEntityID === entityID) {
          return entity.fieldValues.get(fieldID) ?? null;
        }
      }
    }
  }
  throw new Error(
    `An attempt was made to get entity "${entityID}" field value "${fieldID}" for a nonexistant entity.`,
  );
};
