import { Assets, BaseTexture, SCALE_MODES, settings } from "pixi.js";
import app from "pigeon-mode-game-library/api/app";
import sizeScreen from "pigeon-mode-game-library/api/functions/sizeScreen";
import state from "pigeon-mode-game-library/api/state";
import tick from "pigeon-mode-game-library/api/functions/tick";

const init = (): void => {
  console.log("PMGL game initialized.");
  settings.ROUND_PIXELS = true;
  BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;
  if (settings.RENDER_OPTIONS) {
    settings.RENDER_OPTIONS.hello = false;
  }
  app.renderer.view.addEventListener?.("contextmenu", (e: Event): void => {
    e.preventDefault();
  });
  app.ticker.add(tick);
  const screen = document.getElementById("screen");
  screen?.appendChild(app.view as HTMLCanvasElement);
  sizeScreen();
  addEventListener("resize", sizeScreen);
  Assets.load("./fonts/RetroPixels.fnt").then((): void => {
    state.loadedAssets++;
  });
};

export default init;
