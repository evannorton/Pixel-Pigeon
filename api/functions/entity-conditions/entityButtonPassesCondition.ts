import { EntityButton } from "../../types/World";
import { handleCaughtError } from "../handleCaughtError";

export const entityButtonPassesCondition = (
  entityButton: EntityButton,
): boolean => {
  if (typeof entityButton.condition === "undefined") {
    return true;
  }
  try {
    return entityButton.condition();
  } catch (error: unknown) {
    handleCaughtError(
      error,
      `EntityButton "${entityButton.buttonID}" condition`,
      true,
    );
  }
  return false;
};
