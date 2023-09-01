import { state } from "pigeon-mode-game-framework/api/state";

export const getStretchScale = (): number => {
  if (state.values.config === null) {
    throw new Error(
      "An attempt was made to get stretch scale before config was loaded.",
    );
  }
  const aspectRatio: number =
    state.values.config.width / state.values.config.height;
  const screenAspectRatio: number = window.innerWidth / window.innerHeight;
  const stretchedScale: number =
    aspectRatio >= screenAspectRatio
      ? window.innerWidth / state.values.config.width
      : window.innerHeight / state.values.config.height;
  return stretchedScale
}

