import { Level } from "../types/World";
import { state } from "../state";

interface MoveEntityOptions {
  readonly xVelocity?: number;
  readonly yVelocity?: number;
}

export const moveEntity = (
  entityID: string,
  options: MoveEntityOptions,
): void => {
  if (state.values.world === null) {
    throw new Error(
      `An attempt was made to move entity "${entityID}" before world was loaded.`,
    );
  }
  if (state.values.levelID === null) {
    throw new Error(
      `An attempt was made to move entity "${entityID}" with no active level.`,
    );
  }
  const level: Level | null =
    state.values.world.levels.get(state.values.levelID) ?? null;
  if (level === null) {
    throw new Error(
      `An attempt was made to move entity "${entityID}" with a nonexistant active level.`,
    );
  }
  for (const layer of level.layers) {
    for (const [layerEntityID, entity] of layer.entities) {
      if (layerEntityID === entityID) {
        if (typeof options.xVelocity !== "undefined") {
          entity.xVelocity += options.xVelocity;
        }
        if (typeof options.yVelocity !== "undefined") {
          entity.yVelocity += options.yVelocity;
        }
      }
    }
  }
};
