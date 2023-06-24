import { Assets, BaseTexture, SCALE_MODES, settings } from "pixi.js";
import DOMElement from "../classes/DOMElement";
import InputHandler from "../classes/InputHandler";
import Level from "../classes/Level";
import OgmoProject from "../interfaces/ogmo/OgmoProject";
import Sprite from "../classes/Sprite";
import Tileset from "../classes/Tileset";
import app from "../app";
import getDefinables from "./getDefinables";
import sizeScreen from "./sizeScreen";
import state from "../state";
import tick from "./tick";

const init = (): void => {
  if (state.values.isInitialized) {
    throw new Error("Initialization was attempted more than once.");
  }

  console.log("Pigeon Mode Game Library initialized.");

  state.setValues({ isInitialized: true });

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

  fetch("./project.ogmo")
    .then((res): void => {
      res
        .json()
        .then((ogmo: OgmoProject): void => {
          state.setValues({
            loadedAssets: state.values.loadedAssets + 1,
          });
          for (const ogmoTileset of ogmo.tilesets) {
            new Tileset({
              id: ogmoTileset.label.toLowerCase(),
              imagePath: ogmoTileset.path.substring(7),
            });
          }
        })
        .catch((e): void => {
          throw e;
        });
    })
    .catch((e) => {
      throw e;
    });

  getDefinables(Sprite).forEach((sprite) => {
    sprite.loadTexture();
  });

  getDefinables(Level).forEach((level) => {
    level.loadOgmoLevel();
  });

  app.ticker.add(tick);
};

export default init;
