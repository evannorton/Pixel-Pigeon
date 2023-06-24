import { BaseTexture, SCALE_MODES, settings } from "pixi.js";
import DOMElement from "../classes/DOMElement";
import InputHandler from "../classes/InputHandler";
import app from "../app";
import getDefinables from "./getDefinables";
import sizeScreen from "./sizeScreen";
import state from "../state";
import tick from "./tick";
import load from "./load";

const init = (): void => {
  if (state.values.isInitialized) {
    throw new Error("Initialization was attempted more than once.");
  }

  console.log("Pigeon Mode Game Library initialized.");

  state.setValues({ isInitialized: true });

  load()

  const screen = new DOMElement("screen").getElement();

  settings.ROUND_PIXELS = true;
  BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;
  if (settings.RENDER_OPTIONS) {
    settings.RENDER_OPTIONS.hello = false;
  }

  addEventListener("resize", sizeScreen);
  app.renderer.view.addEventListener?.("contextmenu", (event: Event): void => {
    event.preventDefault();
  });
  screen.addEventListener("mousedown", (event: MouseEvent) => {
    if (!state.values.hasInteracted) {
      state.setValues({ hasInteracted: true });
    } else {
      getDefinables(InputHandler).forEach((inputHandler) => {
        inputHandler.handleClick(event.button);
      });
    }
  });
  screen.addEventListener("keydown", (event: KeyboardEvent): void => {
    if (!state.values.heldKeys.includes(event.code)) {
      state.setValues({ heldKeys: [...state.values.heldKeys, event.code] });
      getDefinables(InputHandler).forEach((inputHandler) => {
        inputHandler.handleKey(event.code);
      });
    }
  });
  screen.addEventListener("keyup", (event: KeyboardEvent): void => {
    if (state.values.heldKeys.includes(event.code)) {
      state.setValues({
        heldKeys: state.values.heldKeys.filter((key) => key !== event.code),
      });
    }
  });

  screen.appendChild(app.view as HTMLCanvasElement);

  sizeScreen();

  app.ticker.add(tick);
};

export default init;
