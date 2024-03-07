import { state } from "../state";

export const getDeltaTime = (): number => {
  if (state.values.app === null) {
    throw new Error(
      "An attempt was made to get delta time before app was created.",
    );
  }
  return state.values.app.ticker.deltaMS;
};
