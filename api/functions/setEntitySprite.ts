import { state } from "../state";

export const setEntitySprite = (entityID: string, spriteID: string): void => {
  if (state.values.world === null) {
    throw new Error(
      `An attempt was made to set entity "${entityID}" spriteID before world was loaded.`,
    );
  }
  for (const level of state.values.world.levels.values()) {
    for (const layer of level.layers) {
      for (const [layerEntityID, entity] of layer.entities) {
        if (layerEntityID === entityID) {
          entity.spriteID = spriteID;
        }
      }
    }
  }
};
