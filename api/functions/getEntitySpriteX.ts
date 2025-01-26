import { EntitySprite } from "../types/World";
import { handleCaughtError } from "./handleCaughtError";

export const getEntitySpriteX = (entitySprite: EntitySprite): number => {
  if (typeof entitySprite.x === "undefined") {
    return 0;
  }
  if (typeof entitySprite.x === "number") {
    return entitySprite.x;
  }
  try {
    return entitySprite.x();
  } catch (error) {
    handleCaughtError(error, `EntitySprite "${entitySprite.spriteID}" x`, true);
    return 0;
  }
};
