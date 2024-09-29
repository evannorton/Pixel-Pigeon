import { removeButton } from "../classes/Button";
import { removeEllipse } from "../classes/Ellipse";
import { removeQuadrilateral } from "../classes/Quadrilateral";
import { removeSprite } from "../classes/Sprite";
import { state } from "../state";
import { unlockCameraFromEntity } from "./unlockCameraFromEntity";

/**
 * Removes the given entity from the world
 * @param entityID - String entityID of the Entity to remove
 */
export const removeEntity = (entityID: string): void => {
  if (state.values.world === null) {
    throw new Error(
      `An attempt was made to remove entity instance "${entityID}" before world was loaded.`,
    );
  }
  for (const level of state.values.world.levels.values()) {
    for (const layer of level.layers) {
      for (const [layerEntityID, layerEntity] of layer.entities) {
        if (layerEntityID === entityID) {
          for (const entitySprite of layerEntity.sprites) {
            removeSprite(entitySprite.spriteID);
          }
          for (const entityQuadrilateral of layerEntity.quadrilaterals) {
            removeQuadrilateral(entityQuadrilateral.quadrilateralID);
          }
          for (const entityEllipse of layerEntity.ellipses) {
            removeEllipse(entityEllipse.ellipseID);
          }
          for (const entityButton of layerEntity.buttons) {
            removeButton(entityButton.buttonID);
          }
          layer.entities.delete(layerEntityID);
        }
      }
    }
  }
  if (entityID === state.values.cameraLockedEntityID) {
    unlockCameraFromEntity();
  }
};
