import { state } from "../../state";

export const setMaxFPS = (fps: number): void => {
  if (fps <= 0) {
    throw new Error("FPS must be greater than 0.");
  }
  if (state.values.app === null) {
    throw new Error(
      "An attempt was made to set max FPS before app was created.",
    );
  }
  state.values.app.ticker.maxFPS = fps;
};
