import { Container } from "pixi.js";
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
  anchor.href = (
    state.values.app.renderer.plugins.extract as {
      canvas: (stage: Container) => HTMLCanvasElement;
    }
  )
    .canvas(state.values.app.stage)
    .toDataURL();
  anchor.click();
};
