import { state } from "../state";

export const getLayerEntityIDs = (layerID: string): string[] => {
  if (state.values.world === null) {
    throw new Error(
      `An attempt was made to get layer "${layerID}" entity IDs before world was loaded.`,
    );
  }
  const entityIDs: string[] = [];
  for (const level of state.values.world.levels.values()) {
    for (const layer of level.layers) {
      if (layer.id === layerID) {
        for (const entity of layer.entities.values()) {
          entityIDs.push(entity.id);
        }
      }
    }
  }
  return entityIDs;
};
