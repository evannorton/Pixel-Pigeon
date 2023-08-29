import { updateLevelMovement } from "./updateLevelMovement";
import { updateLevelOverlap } from "./updateLevelOverlap";

export const updateLevel = (): void => {
  updateLevelMovement();
  updateLevelOverlap();
};
