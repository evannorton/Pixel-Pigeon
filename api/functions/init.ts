import { Application, BaseTexture, SCALE_MODES, settings } from "pixi.js";
import Config from "../types/Config";
import DOMElement from "../classes/DOMElement";
import ImageSource from "../classes/ImageSource";
import InputPressHandler from "../classes/InputPressHandler";
import InputTickHandler from "../classes/InputTickHandler";
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
          fetch("./images.json")
            .then((imagesResponse: Response): void => {
              imagesResponse
                .json()
                .then((imagePaths: string[]): void => {
                  for (const imagePath of imagePaths) {
                    new ImageSource({
                      imagePath,
                    });
                  }
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
                          BaseTexture.defaultOptions.scaleMode =
                            SCALE_MODES.NEAREST;
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
                                getDefinables(InputPressHandler).forEach(
                                  (
                                    inputPressHandler: InputPressHandler
                                  ): void => {
                                    inputPressHandler.handleClick(
                                      mousedownEvent.button
                                    );
                                  }
                                );
                              }
                            }
                          );
                          screenElement.addEventListener(
                            "keydown",
                            (keydownEvent: KeyboardEvent): void => {
                              if (
                                !state.values.heldKeys.includes(
                                  keydownEvent.code
                                )
                              ) {
                                state.setValues({
                                  heldKeys: [
                                    ...state.values.heldKeys,
                                    keydownEvent.code,
                                  ],
                                });
                                getDefinables(InputPressHandler).forEach(
                                  (
                                    inputPressHandler: InputPressHandler
                                  ): void => {
                                    inputPressHandler.handleKey(
                                      keydownEvent.code
                                    );
                                  }
                                );
                                getDefinables(InputTickHandler).forEach(
                                  (
                                    inputTickHandler: InputTickHandler<string>
                                  ): void => {
                                    inputTickHandler.handleKeyDown(
                                      keydownEvent.code
                                    );
                                  }
                                );
                              }
                            }
                          );
                          screenElement.addEventListener(
                            "keyup",
                            (keyupEvent: KeyboardEvent): void => {
                              if (
                                state.values.heldKeys.includes(keyupEvent.code)
                              ) {
                                state.setValues({
                                  heldKeys: state.values.heldKeys.filter(
                                    (key: string): boolean =>
                                      key !== keyupEvent.code
                                  ),
                                });
                                getDefinables(InputTickHandler).forEach(
                                  (
                                    inputTickHandler: InputTickHandler<string>
                                  ): void => {
                                    inputTickHandler.handleKeyUp(
                                      keyupEvent.code
                                    );
                                  }
                                );
                              }
                            }
                          );
                          screenElement.addEventListener(
                            "focusout",
                            (): void => {
                              state.setValues({
                                heldGamepadButtons: [],
                                heldKeys: [],
                              });
                              getDefinables(InputTickHandler).forEach(
                                (
                                  inputTickHandler: InputTickHandler<string>
                                ): void => {
                                  inputTickHandler.empty();
                                }
                              );
                            }
                          );
                          screenElement.appendChild(
                            app.view as HTMLCanvasElement
                          );
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
