import { state } from "pigeon-mode-game-framework/api/state";

export const getCurrentTime = (): number => state.values.currentTime;
