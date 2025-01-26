import { EntitySprite } from "../types/World";
import { handleCaughtError } from "./handleCaughtError";

export const getEntitySpriteY = (entitySprite: EntitySprite): number => {
  if (typeof entitySprite.y === "undefined") {
    return 0;
  }
  if (typeof entitySprite.y === "number") {
    return entitySprite.y;
  }
  try {
    return entitySprite.y();
  } catch (error) {
    handleCaughtError(error, `EntitySprite "${entitySprite.spriteID}" y`, true);
    return 0;
  }
};
