import { state } from "../state";

export interface GetEntityIDsOptions {
  layerIDs?: string[];
  levelIDs?: string[];
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
      typeof options.levelIDs === "undefined" ||
      options.levelIDs.includes(level.id)
    ) {
      for (const layer of level.layers) {
        if (
          typeof options.layerIDs === "undefined" ||
          options.layerIDs.includes(layer.id)
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
