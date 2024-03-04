import { state } from "../state";

export const getGameWidth = (): number => {
  if (state.values.config === null) {
    throw new Error(
      "An attempt was made to get game width before config was loaded.",
    );
  }
  return state.values.config.width;
};
