import { updateLevelMovement } from "pigeon-mode-game-framework/api/functions/update/updateLevelMovement";
import { updateLevelOverlap } from "pigeon-mode-game-framework/api/functions/update/updateLevelOverlap";

export const updateLevel = (): void => {
  updateLevelMovement();
  updateLevelOverlap();
};
