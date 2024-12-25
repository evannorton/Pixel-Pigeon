import { state } from "../state";

export const getStretchedHeight = (): number => {
  if (state.values.config === null) {
    throw new Error(
      "An attempt was made to get stretched height before config was loaded.",
    );
  }
  const aspectRatio: number =
    state.values.config.height / state.values.config.width;
  if (window.innerHeight > window.innerWidth) {
    const width: number = Math.floor(window.innerHeight * (1 / aspectRatio));
    if (width <= window.innerWidth) {
      return Math.floor(window.innerHeight);
    }
  }
  const height: number = Math.floor(window.innerWidth * aspectRatio);
  if (height > window.innerHeight) {
    return Math.floor(window.innerHeight);
  }
  return height;
};
