import { updateLevelMovement } from "../update/updateLevelMovement";
import { updateLevelOverlap } from "../update/updateLevelOverlap";
import { updateLevelPathing } from "./updateLevelPathing";

export const updateLevel = (): void => {
  updateLevelMovement();
  updateLevelPathing();
  updateLevelOverlap();
};
