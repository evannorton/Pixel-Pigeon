import { state } from "pigeon-mode-game-framework/api/state";

export const setPauseMenuCondition = (pauseMenuCondition: () => boolean): void =>  {
  state.setValues({ pauseMenuCondition });
}