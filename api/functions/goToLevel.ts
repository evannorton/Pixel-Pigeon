import { state } from "pigeon-mode-game-framework/api/state";

export const goToLevel = (levelID: string): void => {
  state.setValues({ levelID });
};
