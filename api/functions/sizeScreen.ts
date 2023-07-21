import { DOMElement } from "../classes/DOMElement";
import { getDefinable } from "./getDefinable";
import { state } from "../state";

export const sizeScreen = (): void => {
  if (state.values.config === null) {
    throw new Error(
      "An attempt was made to size screen before config was loaded.",
    );
  }
  const screenElement: DOMElement = getDefinable(DOMElement, "screen");
  const aspectRatio: number =
    state.values.config.width / state.values.config.height;
  const screenAspectRatio: number = window.innerWidth / window.innerHeight;
  const stretchedScale: number =
    aspectRatio >= screenAspectRatio
      ? window.innerWidth / state.values.config.width
      : window.innerHeight / state.values.config.height;
  screenElement.getElement().style.width = `${
    state.values.config.width * stretchedScale
  }px`;
  screenElement.getElement().style.height = `${
    state.values.config.height * stretchedScale
  }px`;
};
