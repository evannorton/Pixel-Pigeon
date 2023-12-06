import { removeQuadrilateral } from "../classes/Quadrilateral";
import { removeSpriteInstance } from "../classes/SpriteInstance";
import { state } from "../state";

/**
 * Removes the given entity from the world
 * @param entityID - String entityID of the entity to despawn
 */
export const despawnEntity = (entityID: string): void => {
  if (state.values.world === null) {
    throw new Error(
      `An attempt was made to despawn entity instance "${entityID}" before world was loaded.`,
    );
  }
  for (const level of state.values.world.levels.values()) {
    for (const layer of level.layers) {
      for (const [layerEntityID, layerEntity] of layer.entities) {
        if (layerEntityID === entityID) {
          if (layerEntity.spriteInstanceID !== null) {
            removeSpriteInstance(layerEntity.spriteInstanceID);
          }
          for (const entityQuadrilateral of layerEntity.quadrilaterals) {
            removeQuadrilateral(entityQuadrilateral.quadrilateralID);
          }
          layer.entities.delete(layerEntityID);
        }
      }
    }
  }
};
