import DOMElement from "../classes/DOMElement";
import config from "../config";
import getDefinable from "./getDefinable";

const sizeScreen = (): void => {
  const screenElement: DOMElement = getDefinable(DOMElement, "screen");
  const aspectRatio: number = config.width / config.height;
  const screenAspectRatio: number = window.innerWidth / window.innerHeight;
  const stretchedScale: number =
    aspectRatio >= screenAspectRatio
      ? window.innerWidth / config.width
      : window.innerHeight / config.height;
  screenElement.getElement().style.width = `${config.width * stretchedScale}px`;
  screenElement.getElement().style.height = `${
    config.height * stretchedScale
  }px`;
};

export default sizeScreen;
