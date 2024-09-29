import { EntitySprite } from "../types/World";
import { Sprite } from "../classes/Sprite";
import { getDefinable } from "./getDefinable";
import { state } from "../state";

export const addEntitySprite = (
  entityID: string,
  entitySprite: EntitySprite,
): void => {
  if (state.values.world === null) {
    throw new Error(
      `An attempt was made to add entity "${entityID}" sprite before world was loaded.`,
    );
  }
  for (const level of state.values.world.levels.values()) {
    for (const layer of level.layers) {
      for (const [layerEntityID, entity] of layer.entities) {
        if (layerEntityID === entityID) {
          entity.sprites.push(entitySprite);
          const sprite: Sprite = getDefinable(Sprite, entitySprite.spriteID);
          sprite.entityID = entity.id;
        }
      }
    }
  }
};
