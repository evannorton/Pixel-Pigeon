import { Application, BaseTexture, SCALE_MODES, settings } from "pixi.js";
import { AudioSource } from "../classes/AudioSource";
import { Config } from "../types/Config";
import { Dev } from "../types/Dev";
import { ImageSource } from "../classes/ImageSource";
import { InputPressHandler } from "../classes/InputPressHandler";
import { InputTickHandler } from "../classes/InputTickHandler";
import { LDTK } from "../types/LDTK";
import { assetsAreLoaded } from "./assetsAreLoaded";
import { getDefinable } from "./getDefinable";
import { getDefinables } from "./getDefinables";
import { getWorld } from "./getWorld";
import { loadAssets } from "./loadAssets";
import { sizeScreen } from "./sizeScreen";
import { state } from "../state";
import { tick } from "./tick";

/**
 * Initializes Pigeon-Mode-Game-Framework, only call this once or it will throw an error.
 *
 */
export const init = async (): Promise<void> => {
  if (state.values.isInitialized) {
    throw new Error("Initialization was attempted more than once.");
  }
  const screenElement: HTMLElement | null = document.getElementById("screen");
  if (screenElement === null) {
    throw new Error(
      "An attempt was made to init with no screen element in the DOM.",
    );
  }
  const pauseMenuElement: HTMLElement | null =
    document.getElementById("pause-menu");
  if (pauseMenuElement === null) {
    throw new Error(
      "An attempt was made to init with no pause menu element in the DOM.",
    );
  }
  const pauseButtonElement: HTMLElement | null =
    document.getElementById("pause-button");
  if (pauseButtonElement === null) {
    throw new Error(
      "An attempt was made to init with no pause button element in the DOM.",
    );
  }
  const unpauseButtonElement: HTMLElement | null =
    document.getElementById("unpause-button");
  if (unpauseButtonElement === null) {
    throw new Error(
      "An attempt was made to init with no unpause button element in the DOM.",
    );
  }
  state.setValues({ isInitialized: true });
  const devRes: Response = await fetch("./dev.pmgf");
  const dev: Dev = (await devRes.json()) as Dev;
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
    dev,
    world: getWorld(ldtk),
  });
  loadAssets();
  settings.ROUND_PIXELS = true;
  BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;
  if (settings.RENDER_OPTIONS) {
    settings.RENDER_OPTIONS.hello = false;
  }
  addEventListener("resize", sizeScreen);
  addEventListener("blur", (): void => {
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
  app.renderer.view.addEventListener?.(
    "contextmenu",
    (contextmenuEvent: Event): void => {
      contextmenuEvent.preventDefault();
    },
  );
  screenElement.addEventListener(
    "mousedown",
    (mousedownEvent: MouseEvent): void => {
      if (assetsAreLoaded()) {
        if (!state.values.hasInteracted) {
          state.setValues({ hasInteracted: true });
          document.body.classList.add("interacted");
        } else {
          getDefinables(InputPressHandler).forEach(
            (inputPressHandler: InputPressHandler): void => {
              inputPressHandler.handleClick(mousedownEvent.button);
            },
          );
        }
      }
    },
  );
  addEventListener("keydown", (keydownEvent: KeyboardEvent): void => {
    switch (keydownEvent.code) {
      case "ArrowDown":
      case "ArrowLeft":
      case "ArrowRight":
      case "ArrowUp":
        keydownEvent.preventDefault();
        break;
      case "Numpad2":
      case "Numpad4":
      case "Numpad6":
      case "Numpad8":
        if (keydownEvent.getModifierState("NumLock")) {
          keydownEvent.preventDefault();
        }
        break;
    }
    if (!state.values.heldKeys.includes(keydownEvent.code)) {
      state.setValues({
        heldKeys: [...state.values.heldKeys, keydownEvent.code],
      });
      getDefinables(InputPressHandler).forEach(
        (inputPressHandler: InputPressHandler): void => {
          inputPressHandler.handleKey(
            keydownEvent.code,
            keydownEvent.getModifierState("NumLock"),
          );
        },
      );
      getDefinables(InputTickHandler).forEach(
        (inputTickHandler: InputTickHandler<string>): void => {
          inputTickHandler.handleKeyDown(
            keydownEvent.code,
            keydownEvent.getModifierState("NumLock"),
          );
        },
      );
    }
  });
  addEventListener("keyup", (keyupEvent: KeyboardEvent): void => {
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
  pauseButtonElement.addEventListener("click", (): void => {
    document.body.classList.add("paused");
    const pauseMenuPausedAudioSourceIDs: string[] = [];
    getDefinables(AudioSource).forEach((audioSource: AudioSource): void => {
      if (audioSource.isPlaying()) {
        pauseMenuPausedAudioSourceIDs.push(audioSource.id);
        audioSource.pause();
      }
    });
    pauseMenuElement.focus();
    state.setValues({ pauseMenuPausedAudioSourceIDs });
  });
  unpauseButtonElement.addEventListener("click", (): void => {
    document.body.classList.remove("paused");
    screenElement.focus();
    for (const audioSourceID of state.values.pauseMenuPausedAudioSourceIDs) {
      getDefinable(AudioSource, audioSourceID).play();
    }
  });
  screenElement.appendChild(app.view as HTMLCanvasElement);
  sizeScreen();
  app.ticker.add(tick);
};
