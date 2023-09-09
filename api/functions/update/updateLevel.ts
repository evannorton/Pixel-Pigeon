import { updateLevelMovement } from "../update/updateLevelMovement";
import { updateLevelOverlap } from "../update/updateLevelOverlap";

export const updateLevel = (): void => {
  updateLevelMovement();
  updateLevelOverlap();
};
