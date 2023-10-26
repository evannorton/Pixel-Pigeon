import { Application, BaseTexture, SCALE_MODES, settings } from "pixi.js";
import { AudioSource } from "../classes/AudioSource";
import { Config } from "../types/Config";
import { Dev } from "../types/Dev";
import { ImageSource } from "../classes/ImageSource";
import { KeyboardInput } from "../types/KeyboardInput";
import { LDTK } from "../types/LDTK";
import { MouseInput } from "../types/MouseInput";
import { assetsAreLoaded } from "./assetsAreLoaded";
import { getDefinable } from "./getDefinable";
import { getDefinables } from "./getDefinables";
import { getWorld } from "./getWorld";
import { goToPauseMenuSection } from "./goToPauseMenuSection";
import { loadAssets } from "./loadAssets";
import { sizeScreen } from "./sizeScreen";
import { state } from "../state";
import { tick } from "./tick";

export const performInitialization = async (): Promise<void> => {
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
  const mainVolumeSliderInputElement: HTMLElement | null =
    document.getElementById("main-volume-slider-input");
  if (mainVolumeSliderInputElement === null) {
    throw new Error(
      "An attempt was made to get main adjusted volume with no main volume slider element in the DOM.",
    );
  }
  const muteToggleInputElement: HTMLElement | null =
    document.getElementById("mute-toggle-input");
  if (muteToggleInputElement === null) {
    throw new Error(
      "An attempt was made to get main adjusted volume with no mute toggle element in the DOM.",
    );
  }
  const achievementsButtonElement: HTMLElement | null = document.getElementById(
    "achievements-button",
  );
  if (achievementsButtonElement === null) {
    throw new Error(
      "An attempt was made to init with no achievements button element in the DOM.",
    );
  }
  const pauseBackButtonElements: HTMLCollectionOf<Element> =
    document.getElementsByClassName("pause-back-button");
  state.setValues({ isInitialized: true });
  const devRes: Response = await fetch("./pp-dev.json");
  const dev: Dev = (await devRes.json()) as Dev;
  const configRes: Response = await fetch("./pp-config.json");
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
      didBlur: true,
    });
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
      if (assetsAreLoaded() && !state.values.hasInteracted) {
        state.setValues({ hasInteracted: true });
        document.body.classList.add("interacted");
      } else if (
        state.values.heldMouseInputs.some(
          (heldMouseInput: MouseInput): boolean =>
            heldMouseInput.button === mousedownEvent.button,
        ) === false
      ) {
        const mouseInput: MouseInput = {
          button: mousedownEvent.button,
        };
        state.setValues({
          heldMouseInputs: [...state.values.heldMouseInputs, mouseInput],
        });
        if (state.values.hasInteracted) {
          state.setValues({
            pressedMouseInputs: [
              ...state.values.pressedMouseInputs,
              mouseInput,
            ],
          });
        }
      }
    },
  );
  screenElement.addEventListener(
    "mouseup",
    (mouseupEvent: MouseEvent): void => {
      state.setValues({
        heldMouseInputs: state.values.heldMouseInputs.filter(
          (heldMouseInput: MouseInput): boolean =>
            heldMouseInput.button !== mouseupEvent.button,
        ),
      });
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
    if (
      state.values.heldKeyboardInputs.some(
        (heldKeyboardInput: KeyboardInput): boolean =>
          heldKeyboardInput.button === keydownEvent.code,
      ) === false
    ) {
      const keyboardInput: KeyboardInput = {
        button: keydownEvent.code,
        numlock: keydownEvent.getModifierState("NumLock"),
      };
      state.setValues({
        heldKeyboardInputs: [...state.values.heldKeyboardInputs, keyboardInput],
      });
      if (state.values.hasInteracted) {
        state.setValues({
          pressedKeyboardInputs: [
            ...state.values.pressedKeyboardInputs,
            keyboardInput,
          ],
        });
      }
    }
  });
  addEventListener("keyup", (keyupEvent: KeyboardEvent): void => {
    state.setValues({
      heldKeyboardInputs: state.values.heldKeyboardInputs.filter(
        (heldKeyboardInput: KeyboardInput): boolean =>
          heldKeyboardInput.button !== keyupEvent.code,
      ),
    });
  });
  pauseButtonElement.addEventListener("click", (): void => {
    document.body.classList.add("paused");
    goToPauseMenuSection("main");
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
      getDefinable(AudioSource, audioSourceID).resume();
    }
  });
  mainVolumeSliderInputElement.addEventListener("input", (): void => {
    for (const [, audioSource] of getDefinables(AudioSource)) {
      audioSource.updateVolume();
    }
  });
  mainVolumeSliderInputElement.addEventListener("mouseup", (): void => {
    state.values.volumeTestHowl.volume(
      (mainVolumeSliderInputElement as HTMLInputElement).valueAsNumber / 100,
    );
    state.values.volumeTestHowl.play();
  });
  muteToggleInputElement.addEventListener("click", (): void => {
    if ((muteToggleInputElement as HTMLInputElement).checked) {
      getDefinables(AudioSource).forEach((audioSource: AudioSource): void => {
        audioSource.mute();
      });
    } else {
      getDefinables(AudioSource).forEach((audioSource: AudioSource): void => {
        audioSource.unmute();
      });
    }
  });
  achievementsButtonElement.addEventListener("click", (): void => {
    goToPauseMenuSection("achievements");
  });
  for (const pauseBackButtonElement of pauseBackButtonElements) {
    pauseBackButtonElement.addEventListener("click", (): void => {
      goToPauseMenuSection("main");
    });
  }
  screenElement.appendChild(app.view as HTMLCanvasElement);
  sizeScreen();
  app.ticker.add(tick);
};