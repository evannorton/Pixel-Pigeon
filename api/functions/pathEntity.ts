import { state } from "../state";

export interface PathEntityOptions {
  velocity: number;
  x: number;
  y: number;
}
export const pathEntity = (
  entityID: string,
  options: PathEntityOptions,
): void => {
  if (state.values.world === null) {
    throw new Error(
      `An attempt was made to path entity "${entityID}" before world was loaded.`,
    );
  }
  for (const level of state.values.world.levels.values()) {
    for (const layer of level.layers) {
      for (const [layerEntityID, entity] of layer.entities) {
        if (layerEntityID === entityID) {
          entity.movementVelocity = null;
          entity.pathing = {
            velocity: options.velocity,
            x: options.x,
            y: options.y,
          };
        }
      }
    }
  }
};
