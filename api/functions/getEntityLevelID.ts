import { state } from "../state";

export const getEntityLevelID = (entityID: string): string => {
  if (state.values.world === null) {
    throw new Error(
      `An attempt was made to get entity "${entityID}" level ID before world was loaded.`,
    );
  }
  for (const level of state.values.world.levels.values()) {
    for (const layer of level.layers) {
      for (const [layerEntityID] of layer.entityIDs) {
        if (layerEntityID === entityID) {
          return level.id;
        }
      }
    }
  }
  throw new Error(
    `An attempt was made to get entity "${entityID}" level ID for a nonexistant entity.`,
  );
};
