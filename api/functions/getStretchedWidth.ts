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
    const height: number = Math.floor(window.innerWidth * (1 / aspectRatio));
    if (height <= window.innerHeight) {
      return Math.floor(window.innerWidth);
    }
  }
  const width: number = Math.floor(window.innerHeight * aspectRatio);
  if (width > window.innerWidth) {
    return Math.floor(window.innerWidth);
  }
  return width;
};
