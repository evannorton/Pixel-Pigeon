import { EntitySprite } from "../types/World";
import { state } from "../state";

export const removeEntitySprite = (
  entityID: string,
  spriteID: string,
): void => {
  if (state.values.world === null) {
    throw new Error(
      `An attempt was made to remove entity "${entityID}" sprite before world was loaded.`,
    );
  }
  for (const level of state.values.world.levels.values()) {
    for (const layer of level.layers) {
      for (const [layerEntityID, entity] of layer.entities) {
        if (layerEntityID === entityID) {
          entity.sprites = entity.sprites.filter(
            (sprite: EntitySprite): boolean => sprite.spriteID !== spriteID,
          );
        }
      }
    }
  }
};
