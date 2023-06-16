import { Assets, BaseTexture, SCALE_MODES, settings } from "pixi.js";
import app from "../app";
import sizeScreen from "./sizeScreen";
import state from "../state";
import tick from "./tick";
import DOMElement from "../classes/DOMElement";
import getDefinables from "./getDefinables";
import InputHandler from "../classes/InputHandler";

const init = (): void => {
  console.log("PMGL game initialized.");

  const screen = new DOMElement("screen").getElement();

  settings.ROUND_PIXELS = true;
  BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;
  if (settings.RENDER_OPTIONS) {
    settings.RENDER_OPTIONS.hello = false;
  }

  addEventListener("resize", sizeScreen);
  app.renderer.view.addEventListener?.("contextmenu", (e: Event): void => {
    e.preventDefault();
  });
  screen.addEventListener("mousedown", () => {
    if (!state.hasInteracted) {
      state.hasInteracted = true;
      getDefinables(InputHandler).forEach((inputHandler) => {
        inputHandler.listen();
      });
    }
  });

  screen.appendChild(app.view as HTMLCanvasElement);

  sizeScreen();

  Assets.load("./fonts/RetroPixels.fnt")
    .then((): void => {
      state.loadedAssets++;
    })
    .catch((e) => {
      throw e;
    });

  app.ticker.add(tick);
};

export default init;
