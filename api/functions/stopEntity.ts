import { Level } from "pigeon-mode-game-framework/api/types/World";
import { state } from "pigeon-mode-game-framework/api/state";

export interface StopEntityOptions {
  readonly x?: boolean;
  readonly y?: boolean;
}
export const stopEntity = (
  entityID: string,
  options: StopEntityOptions,
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
        if (typeof options.x !== "undefined" && options.x) {
          entity.xVelocity = 0;
        }
        if (typeof options.y !== "undefined" && options.y) {
          entity.yVelocity = 0;
        }
      }
    }
  }
};
