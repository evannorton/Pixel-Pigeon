import { state } from "../../state";

export const getFPS = (): number => {
  if (state.values.app === null) {
    throw new Error("An attempt was made to get FPS before app was created.");
  }
  return state.values.app.ticker.FPS;
};
