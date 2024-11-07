import { EntityEllipse } from "../../types/World";
import { handleCaughtError } from "../handleCaughtError";

export const entityEllipsePassesCondition = (
  entityEllipse: EntityEllipse,
): boolean => {
  if (typeof entityEllipse.condition === "undefined") {
    return true;
  }
  try {
    return entityEllipse.condition();
  } catch (error: unknown) {
    handleCaughtError(
      error,
      `EntityEllipse "${entityEllipse.ellipseID}" condition`,
      true,
    );
  }
  return false;
};
