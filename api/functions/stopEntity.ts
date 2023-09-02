import { Level } from "pigeon-mode-game-framework/api/types/World";
import { state } from "pigeon-mode-game-framework/api/state";

/**
 * Each of these being set to true represents that when plugged into {@link stopEntity}, that velocity should be cancelled out
 */
export interface StopEntityOptions {
  /**
   * Stop moving the entity on the X direction?
   */
  readonly x?: boolean;
  /**
   * Stop moving the entity on the Y direction?
   */
  readonly y?: boolean;
}
/**
 * 
 * @param entityID - String EntityID to determine what entity to perform the operation on
 * @param options - Options to determine which coordinates to stop moving the entity on
 */
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
