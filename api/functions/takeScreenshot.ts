import { ICanvas, Rectangle } from "pixi.js";
import { state } from "../state";

export const takeScreenshot = (): void => {
  if (state.values.config === null) {
    throw new Error("Attempted to take screenshot before config was loaded.");
  }
  if (state.values.app === null) {
    throw new Error("Attempted to take screenshot before app was created.");
  }
  const anchor: HTMLAnchorElement = document.createElement("a");
  anchor.download = `${state.values.config.name} screenshot.png`;
  const canvas: ICanvas = state.values.app.renderer.extract.canvas(
    state.values.app.stage,
    new Rectangle(0, 0, state.values.config.width, state.values.config.height),
  );
  if (typeof canvas.toDataURL === "undefined") {
    throw new Error(
      'Attempted to take screenshot of a canvas with no "toDataURL" method.',
    );
  }
  anchor.href = canvas.toDataURL();
  anchor.click();
};
