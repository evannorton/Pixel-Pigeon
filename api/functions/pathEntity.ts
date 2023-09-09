import { Level } from "../types/World";
import { state } from "../state";

export interface PathEntityOptions {
  readonly velocity: number;
  readonly x: number;
  readonly y: number;
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
  if (state.values.levelID === null) {
    throw new Error(
      `An attempt was made to path entity "${entityID}" with no active level.`,
    );
  }
  const level: Level | null =
    state.values.world.levels.get(state.values.levelID) ?? null;
  if (level === null) {
    throw new Error(
      `An attempt was made to path entity "${entityID}" with a nonexistant active level.`,
    );
  }
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
};
