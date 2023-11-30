import { state } from "../state";

interface GetEntityIDsOptions {
  layerID?: string;
  levelID?: string;
}

export const getEntityIDs = (options: GetEntityIDsOptions): string[] => {
  if (state.values.world === null) {
    throw new Error(
      `An attempt was made to get entity IDs before world was loaded.`,
    );
  }
  const entityIDs: string[] = [];
  for (const level of state.values.world.levels.values()) {
    if (
      typeof options.levelID === "undefined" ||
      level.id === options.levelID
    ) {
      for (const layer of level.layers) {
        if (
          typeof options.layerID === "undefined" ||
          layer.id === options.layerID
        ) {
          for (const entity of layer.entities.values()) {
            entityIDs.push(entity.id);
          }
        }
      }
    }
  }
  return entityIDs;
};
