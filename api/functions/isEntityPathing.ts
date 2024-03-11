import { state } from "../state";

export const isEntityPathing = (entityID: string): boolean => {
  if (state.values.world === null) {
    throw new Error(
      `An attempt was made to check pathing of entity "${entityID}" before world was loaded.`,
    );
  }
  for (const level of state.values.world.levels.values()) {
    for (const layer of level.layers) {
      for (const [layerEntityID, entity] of layer.entities) {
        if (layerEntityID === entityID) {
          return entity.path !== null && entity.path.length > 0;
        }
      }
    }
  }
  return false;
};
