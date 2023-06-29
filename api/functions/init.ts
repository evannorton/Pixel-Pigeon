import { Application, BaseTexture, SCALE_MODES, settings } from "pixi.js";
import Config from "../types/Config";
import DOMElement from "../classes/DOMElement";
import InputHandler from "../classes/InputHandler";
import LDTK from "../types/LDTK";
import getDefinables from "./getDefinables";
import getWorld from "./getWorld";
import loadAssets from "./loadAssets";
import sizeScreen from "./sizeScreen";
import state from "../state";
import tick from "./tick";

const init = (): void => {
  if (state.values.isInitialized) {
    throw new Error("Initialization was attempted more than once.");
  }
  console.log("Pigeon Mode Game Library initialized.");
  state.setValues({ isInitialized: true });
  fetch("./config.pmgl")
    .then((configRes: Response): void => {
      configRes
        .json()
        .then((config: Config): void => {
          fetch("./project.ldtk")
            .then((ldtkRes: Response): void => {
              ldtkRes
                .json()
                .then((ldtk: LDTK): void => {
                  const app: Application = new Application({
                    height: config.height,
                    width: config.width,
                  });
                  state.setValues({
                    app,
                    config,
                    world: getWorld(ldtk),
                  });
                  loadAssets();
                  const screenElement: HTMLElement = new DOMElement({
                    id: "screen",
                  }).getElement();
                  settings.ROUND_PIXELS = true;
                  BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;
                  if (settings.RENDER_OPTIONS) {
                    settings.RENDER_OPTIONS.hello = false;
                  }
                  addEventListener("resize", sizeScreen);
                  app.renderer.view.addEventListener?.(
                    "contextmenu",
                    (contextmenuEvent: Event): void => {
                      contextmenuEvent.preventDefault();
                    }
                  );
                  screenElement.addEventListener(
                    "mousedown",
                    (mousedownEvent: MouseEvent): void => {
                      if (!state.values.hasInteracted) {
                        state.setValues({ hasInteracted: true });
                      } else {
                        getDefinables(InputHandler).forEach(
                          (inputHandler: InputHandler): void => {
                            inputHandler.handleClick(mousedownEvent.button);
                          }
                        );
                      }
                    }
                  );
                  screenElement.addEventListener(
                    "keydown",
                    (keydownEvent: KeyboardEvent): void => {
                      if (!state.values.heldKeys.includes(keydownEvent.code)) {
                        state.setValues({
                          heldKeys: [
                            ...state.values.heldKeys,
                            keydownEvent.code,
                          ],
                        });
                        getDefinables(InputHandler).forEach(
                          (inputHandler: InputHandler): void => {
                            inputHandler.handleKey(keydownEvent.code);
                          }
                        );
                      }
                    }
                  );
                  screenElement.addEventListener(
                    "keyup",
                    (keyupEvent: KeyboardEvent): void => {
                      if (state.values.heldKeys.includes(keyupEvent.code)) {
                        state.setValues({
                          heldKeys: state.values.heldKeys.filter(
                            (key: string): boolean => key !== keyupEvent.code
                          ),
                        });
                      }
                    }
                  );
                  screenElement.appendChild(app.view as HTMLCanvasElement);
                  sizeScreen();
                  app.ticker.add(tick);
                })
                .catch((error: Error): void => {
                  throw error;
                });
            })
            .catch((error: Error): void => {
              throw error;
            });
        })
        .catch((error: Error): void => {
          throw error;
        });
    })
    .catch((error: Error): void => {
      throw error;
    });
};

export default init;
