import { handleCaughtError } from "./handleCaughtError";
import { state } from "../state";

export const passesPauseMenuCondition = (): boolean => {
  if (state.values.pauseMenuCondition !== null) {
    try {
      return state.values.pauseMenuCondition();
    } catch (error: unknown) {
      handleCaughtError(error, "pause menu condition", true);
    }
  }
  return false;
};
