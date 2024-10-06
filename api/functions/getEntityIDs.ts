import { Entity } from "../classes/Entity";
import { getDefinable } from "definables";
import { state } from "../state";

export interface GetEntityIDsOptions {
  layerIDs?: string[];
  levelIDs?: string[];
  types?: string[];
}
export const getEntityIDs = (
  options: GetEntityIDsOptions,
): readonly string[] => {
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
          for (const entityID of layer.entityIDs.values()) {
            const entity: Entity = getDefinable(Entity, entityID);
            if (
              typeof options.types === "undefined" ||
              (entity.hasType() && options.types.includes(entity.type))
            ) {
              entityIDs.push(entity.id);
            }
          }
        }
      }
    }
  }
  return entityIDs;
};
