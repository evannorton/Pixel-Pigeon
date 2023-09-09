import { Level } from "../types/World";
import { state } from "../state";

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
        entity.movementVelocity = {
          x: options.xVelocity ?? 0,
          y: options.yVelocity ?? 0,
        };
        entity.pathing = null;
      }
    }
  }
};
