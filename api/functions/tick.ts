import { gameIsPaused } from "./gameIsPaused";
import { render } from "./render";
import { state } from "../state";
import { update } from "./update/update";

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
  if (state.values.hasInteracted && !state.values.hasExecutedOnRunCallbacks) {
    for (const onRunCallback of state.values.onRunCallbacks) {
      onRunCallback();
    }
    state.setValues({ hasExecutedOnRunCallbacks: true });
  }
};
