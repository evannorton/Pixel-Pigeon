import { state } from "../state";

export const getStretchedWidth = (): number => {
  if (state.values.config === null) {
    throw new Error(
      "An attempt was made to get stretched width before config was loaded.",
    );
  }
  const aspectRatio: number =
    state.values.config.width / state.values.config.height;
  if (window.innerWidth > window.innerHeight) {
    return Math.floor(window.innerWidth);
  }
  return Math.floor(window.innerHeight * aspectRatio);
};
