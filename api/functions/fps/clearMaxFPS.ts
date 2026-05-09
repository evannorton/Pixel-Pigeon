import { state } from "../../state";

export const clearMaxFPS = (): void => {
  if (state.values.app === null) {
    throw new Error(
      "An attempt was made to clear max FPS before app was created.",
    );
  }
  state.values.app.ticker.maxFPS = 0;
};
