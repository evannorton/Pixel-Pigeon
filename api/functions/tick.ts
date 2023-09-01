import { render } from "pigeon-mode-game-framework/api/functions/render";
import { state } from "pigeon-mode-game-framework/api/state";
import { update } from "pigeon-mode-game-framework/api/functions/update/update";
import { gameIsPaused } from "pigeon-mode-game-framework/api/functions/gameIsPaused";

export const tick = (): void => {
  if (state.values.app === null) {
    throw new Error("An attempt was made to tick before app was created.");
  }
  if (!gameIsPaused()) {
    state.setValues({
      currentTime: state.values.currentTime + state.values.app.ticker.deltaMS,
    });
    update();
    render();
  }
};
