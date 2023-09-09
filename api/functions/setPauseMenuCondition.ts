import { state } from "../state";

/**
 * Define a callback to determine whether or not the pause button should appear on screen
 * @param pauseMenuCondition - Callback that should return true if the user should have the option to pause the game at the current time,
 * **not** if the game should be paused currently
 */
export const setPauseMenuCondition = (
  pauseMenuCondition: () => boolean,
): void => {
  state.setValues({ pauseMenuCondition });
};
