import { EntityQuadrilateral } from "../../types/World";
import { handleCaughtError } from "../handleCaughtError";

export const entityQuadrilateralPassesCondition = (
  entityQuadrilateral: EntityQuadrilateral,
): boolean => {
  if (typeof entityQuadrilateral.condition === "undefined") {
    return true;
  }
  try {
    return entityQuadrilateral.condition();
  } catch (error: unknown) {
    handleCaughtError(
      error,
      `EntityQuadrilateral "${entityQuadrilateral.quadrilateralID}" condition`,
      true,
    );
  }
  return false;
};
