import { getStretchScale } from "./getStretchScale";
import { state } from "../state";

export const sizeScreen = (): void => {
  if (state.values.config === null) {
    throw new Error(
      "An attempt was made to size screen before config was loaded.",
    );
  }
  const stretchScale: number = getStretchScale();
  const screenWidth: number = state.values.config.width * stretchScale;
  const screenHeight: number = state.values.config.height * stretchScale;
  const screenElement: HTMLElement | null = document.getElementById("screen");
  if (screenElement === null) {
    throw new Error(
      "An attempt was made to size screen with no screen element in the DOM.",
    );
  }
  screenElement.style.width = `${screenWidth}px`;
  screenElement.style.height = `${screenHeight}px`;
  const achievementUnlockNoticesElement: HTMLElement | null =
    document.getElementById("achievement-unlock-notices");
  if (achievementUnlockNoticesElement === null) {
    throw new Error(
      "An attempt was made to size screen with no avh element in the DOM.",
    );
  }
  achievementUnlockNoticesElement.style.width = `${screenWidth}px`;
  achievementUnlockNoticesElement.style.height = `${screenHeight}px`;
  const pauseMenuElement: HTMLElement | null =
    document.getElementById("pause-menu");
  if (pauseMenuElement === null) {
    throw new Error(
      "An attempt was made to size screen with no pause menu element in the DOM.",
    );
  }
  pauseMenuElement.style.width = `${screenWidth}px`;
  pauseMenuElement.style.height = `${screenHeight}px`;
  const pauseButtonsElement: HTMLElement | null =
    document.getElementById("pause-buttons");
  if (pauseButtonsElement === null) {
    throw new Error(
      "An attempt was made to size screen with no pause menu element in the DOM.",
    );
  }
  pauseButtonsElement.style.width = `${screenWidth}px`;
  pauseButtonsElement.style.height = `${screenHeight}px`;
  const lowerDimension: number = Math.min(
    state.values.config.width,
    state.values.config.height,
  );
  const width: number = (lowerDimension / 20) * stretchScale;
  const margin: number = (lowerDimension / 40) * stretchScale;
  for (const element of document.getElementsByClassName("pause-toggle")) {
    if (!(element instanceof HTMLElement)) {
      throw new Error(
        "An element with class pause-toggle was not an HTMLElement.",
      );
    }
    element.style.width = `${width}px`;
    element.style.top = `${margin}px`;
    element.style.left = `${margin}px`;
  }
};
