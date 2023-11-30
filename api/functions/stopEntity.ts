import { state } from "../state";

/**
 *
 * @param entityID - String EntityID to determine what entity to perform the operation on
 * @param options - Options to determine which coordinates to stop moving the entity on
 */
export const stopEntity = (entityID: string): void => {
  if (state.values.world === null) {
    throw new Error(
      `An attempt was made to move entity "${entityID}" before world was loaded.`,
    );
  }
  for (const level of state.values.world.levels.values()) {
    for (const layer of level.layers) {
      for (const [layerEntityID, entity] of layer.entities) {
        if (layerEntityID === entityID) {
          entity.movementVelocity = null;
          entity.pathing = null;
        }
      }
    }
  }
};
