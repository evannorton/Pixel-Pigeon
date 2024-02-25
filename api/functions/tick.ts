import { gameIsPaused } from "./gameIsPaused";
import { render } from "./render";
import { state } from "../state";
import { update } from "./update/update";
import { updateGamepadBinding } from "./updateGamepadBinding";

export const tick = (): void => {
  if (state.values.app === null) {
    throw new Error("An attempt was made to tick before app was created.");
  }
  if (!gameIsPaused()) {
    state.setValues({
      currentTime: state.values.currentTime + state.values.app.ticker.deltaMS,
    });
    if (state.values.hasInteracted) {
      update();
    }
    render();
  }
  updateGamepadBinding();
};
