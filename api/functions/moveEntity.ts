import { state } from "../state";

/**
 * The amount an entity is moving when supplied to {@link moveEntity}
 */
export interface MoveEntityOptions {
  /**
   * Amount the entity is moving across the X-axis
   */
  xVelocity?: number;
  /**
   * Amount the entity is moving across the Y-axis
   */
  yVelocity?: number;
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
  for (const level of state.values.world.levels.values()) {
    for (const layer of level.layers) {
      for (const [layerEntityID, entity] of layer.entities) {
        if (layerEntityID === entityID) {
          entity.movementVelocity = {
            x: options.xVelocity ?? 0,
            y: options.yVelocity ?? 0,
          };
          entity.hasTouchedPathingStartingTile = false;
          entity.lastPathedTilePosition = null;
          entity.path = null;
          entity.pathing = null;
        }
      }
    }
  }
};
