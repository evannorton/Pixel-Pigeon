import { EntitySprite } from "../../types/World";
import { handleCaughtError } from "../handleCaughtError";

export const entitySpritePassesCondition = (
  entitySprite: EntitySprite,
): boolean => {
  if (typeof entitySprite.condition === "undefined") {
    return true;
  }
  try {
    return entitySprite.condition();
  } catch (error: unknown) {
    handleCaughtError(
      error,
      `EntitySprite "${entitySprite.spriteID}" condition`,
      true,
    );
  }
  return false;
};
