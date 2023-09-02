import { Level } from "pigeon-mode-game-framework/api/types/World";
import { state } from "pigeon-mode-game-framework/api/state";

/**
 * The amount an entity is moving when supplied to {@link moveEntity}
 */
export interface MoveEntityOptions {
  /**
   * Amount the entity is moving across the X-axis
   */
  readonly xVelocity?: number;
    /**
   * Amount the entity is moving across the Y-axis
   */
  readonly yVelocity?: number;
}
/**
 * Move the specified entity by the specified amount in the world
 * @param entityID - The string entityID of the entity to be moved
 * @param options - The amount the entity moves
 */
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
