import { state } from "../state";

export const getGameHeight = (): number => {
  if (state.values.config === null) {
    throw new Error(
      "An attempt was made to get game height before config was loaded.",
    );
  }
  return state.values.config.height;
};
