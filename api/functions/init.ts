import { Application, BaseTexture, SCALE_MODES, settings } from "pixi.js";
import { AudioSource } from "pigeon-mode-game-framework/api/classes/AudioSource";
import { Config } from "pigeon-mode-game-framework/api/types/Config";
import { DOMElement } from "pigeon-mode-game-framework/api/classes/DOMElement";
import { ImageSource } from "pigeon-mode-game-framework/api/classes/ImageSource";
import { InputPressHandler } from "pigeon-mode-game-framework/api/classes/InputPressHandler";
import { InputTickHandler } from "pigeon-mode-game-framework/api/classes/InputTickHandler";
import { LDTK } from "pigeon-mode-game-framework/api/types/LDTK";
import { getDefinables } from "pigeon-mode-game-framework/api/functions/getDefinables";
import { getWorld } from "pigeon-mode-game-framework/api/functions/getWorld";
import { loadAssets } from "pigeon-mode-game-framework/api/functions/loadAssets";
import { sizeScreen } from "pigeon-mode-game-framework/api/functions/sizeScreen";
import { state } from "pigeon-mode-game-framework/api/state";
import { tick } from "pigeon-mode-game-framework/api/functions/tick";

export const init = async (): Promise<void> => {
  if (state.values.isInitialized) {
    throw new Error("Initialization was attempted more than once.");
  }
  state.setValues({ isInitialized: true });
  const configRes: Response = await fetch("./config.pmgf");
  const config: Config = (await configRes.json()) as Config;
  const audioResponse: Response = await fetch("./audio.json");
  const audioPaths: string[] = (await audioResponse.json()) as string[];
  for (const audioPath of audioPaths) {
    new AudioSource({
      audioPath,
    });
  }
  const imagesResponse: Response = await fetch("./images.json");
  const imagePaths: string[] = (await imagesResponse.json()) as string[];
  for (const imagePath of imagePaths) {
    new ImageSource({
      imagePath,
    });
  }
  const ldtkRes: Response = await fetch("./project.ldtk");
  const ldtk: LDTK = (await ldtkRes.json()) as LDTK;
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
    },
  );
  screenElement.addEventListener(
    "mousedown",
    (mousedownEvent: MouseEvent): void => {
      if (!state.values.hasInteracted) {
        state.setValues({ hasInteracted: true });
      } else {
        getDefinables(InputPressHandler).forEach(
          (inputPressHandler: InputPressHandler): void => {
            inputPressHandler.handleClick(mousedownEvent.button);
          },
        );
      }
    },
  );
  screenElement.addEventListener(
    "keydown",
    (keydownEvent: KeyboardEvent): void => {
      if (!state.values.heldKeys.includes(keydownEvent.code)) {
        state.setValues({
          heldKeys: [...state.values.heldKeys, keydownEvent.code],
        });
        getDefinables(InputPressHandler).forEach(
          (inputPressHandler: InputPressHandler): void => {
            inputPressHandler.handleKey(keydownEvent.code);
          },
        );
        getDefinables(InputTickHandler).forEach(
          (inputTickHandler: InputTickHandler<string>): void => {
            inputTickHandler.handleKeyDown(keydownEvent.code);
          },
        );
      }
    },
  );
  screenElement.addEventListener("keyup", (keyupEvent: KeyboardEvent): void => {
    if (state.values.heldKeys.includes(keyupEvent.code)) {
      state.setValues({
        heldKeys: state.values.heldKeys.filter(
          (key: string): boolean => key !== keyupEvent.code,
        ),
      });
      getDefinables(InputTickHandler).forEach(
        (inputTickHandler: InputTickHandler<string>): void => {
          inputTickHandler.handleKeyUp(keyupEvent.code);
        },
      );
    }
  });
  screenElement.addEventListener("focusout", (): void => {
    state.setValues({
      heldGamepadButtons: [],
      heldKeys: [],
    });
    getDefinables(InputTickHandler).forEach(
      (inputTickHandler: InputTickHandler<string>): void => {
        inputTickHandler.empty();
      },
    );
  });
  screenElement.appendChild(app.view as HTMLCanvasElement);
  sizeScreen();
  app.ticker.add(tick);
};
