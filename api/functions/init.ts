import { Assets, BaseTexture, SCALE_MODES, settings } from "pixi.js";
import DOMElement from "../classes/DOMElement";
import InputHandler from "../classes/InputHandler";
import Ogmo from "../interfaces/Ogmo";
import app from "../app";
import getDefinables from "./getDefinables";
import sizeScreen from "./sizeScreen";
import state from "../state";
import tick from "./tick";

const init = (): void => {
  console.log("PMGL game initialized.");

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

  Assets.load("./fonts/RetroPixels.fnt")
    .then((): void => {
      state.setValues({ loadedAssets: state.values.loadedAssets + 1 });
    })
    .catch((e) => {
      throw e;
    });

  fetch("./project.ogmo").then((res): void => {
    res.json().then((ogmo: Ogmo): void => {
      state.setValues({ loadedAssets: state.values.loadedAssets + 1, ogmo });
    }).catch((): void => {
      throw new Error("project.ogmo is not valid JSON.")
    });
  });

  app.ticker.add(tick);
};

export default init;
