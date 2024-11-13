import { Achievement } from "../classes/Achievement";
import {
  Application,
  BaseTexture,
  BitmapFont,
  SCALE_MODES,
  settings,
} from "pixi.js";
import { AudioSource } from "../classes/AudioSource";
import { Button } from "../classes/Button";
import { Config } from "../types/Config";
import { Dev } from "../types/Dev";
import { Env } from "../types/Env";
import { ImageSource } from "../classes/ImageSource";
import { InputCollection } from "../classes/InputCollection";
import { KeyboardInput } from "../types/KeyboardInput";
import { LDTK } from "../types/LDTK";
import { MouseInput } from "../types/MouseInput";
import {
  addInputBodyBoxElement,
  addInputBodyBoxTextElement,
  addInputBodyNumlockWithElement,
  addInputBodyNumlockWithInputElement,
  addInputBodyNumlockWithoutElement,
  addInputBodyNumlockWithoutInputElement,
} from "../elements/addInputBodyElement";
import { assetsAreLoaded } from "./assetsAreLoaded";
import { cleanStorage } from "./storage/cleanStorage";
import { fireAlert } from "./fireAlert";
import { getDefinable, getDefinables } from "definables";
import { getStretchScale } from "./getStretchScale";
import { goToPauseMenuSection } from "./goToPauseMenuSection";
import { handleUncaughtError } from "./handleUncaughtError";
import { loadAssets } from "./loadAssets";
import { sizeScreen } from "./sizeScreen";
import { state } from "../state";
import { syncNewgroundsMedals } from "./syncNewgroundsMedals";
import { takeScreenshot } from "./takeScreenshot";
import { tick } from "./tick";
import { updateAchievementsCount } from "./updateAchievementsCount";
import { volumeTestHowl } from "../howls/volumeTestHowl";

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
  const screenshotButtonElement: HTMLElement | null =
    document.getElementById("screenshot-button");
  if (screenshotButtonElement === null) {
    throw new Error(
      "An attempt was made to init with no screenshot button element in the DOM.",
    );
  }
  const controlsButtonElement: HTMLElement | null =
    document.getElementById("controls-button");
  if (controlsButtonElement === null) {
    throw new Error(
      "An attempt was made to init with no controls button element in the DOM.",
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
  const achievementsAmountTotalElement: HTMLElement | null =
    document.getElementById("achievements-amount-total");
  if (achievementsAmountTotalElement === null) {
    throw new Error(
      "An attempt was made to init with no achievements amount total element in the DOM.",
    );
  }
  const controlsResetButtonElement: HTMLElement | null =
    document.getElementById("controls-reset-button");
  if (controlsResetButtonElement === null) {
    throw new Error(
      "An attempt was made to init with no controls reset button element in the DOM.",
    );
  }
  const pauseBackButtonElements: HTMLCollectionOf<Element> =
    document.getElementsByClassName("pause-back-button");
  state.setValues({ isInitialized: true });
  const typeRes: Response = await fetch("./type.json");
  const type: string = (await typeRes.json()) as string;
  const envRes: Response = await fetch("./pp-env.json");
  const env: Env | null = envRes.ok ? ((await envRes.json()) as Env) : null;
  const gameEnvRes: Response = await fetch("./game-env.json");
  const gameEnv: Record<string, unknown> | null = gameEnvRes.ok
    ? ((await gameEnvRes.json()) as Record<string, unknown>)
    : null;
  const devRes: Response = await fetch("./pp-dev.json");
  const dev: Dev | null = devRes.ok ? ((await devRes.json()) as Dev) : null;
  const configRes: Response = await fetch("./pp-config.json");
  const config: Config = (await configRes.json()) as Config;
  const ldtkRes: Response = await fetch("./project.ldtk");
  const ldtk: LDTK | undefined = ldtkRes.ok
    ? ((await ldtkRes.json()) as LDTK)
    : undefined;
  const gameIDRes: Response = await fetch("./pp-id.json");
  const gameID: string | null = (await gameIDRes.json()) as string | null;
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
  if (config.requireClickToFocus === false) {
    state.setValues({ hasInteracted: true });
  }
  const app: Application<HTMLCanvasElement> = new Application({
    backgroundAlpha: 0,
    height: config.height,
    width: config.width,
  });
  state.setValues({
    app,
    config,
    dev,
    env,
    gameEnv,
    gameID,
    ldtk,
    type,
  });
  cleanStorage();
  getDefinables(Achievement).forEach((achievement: Achievement): void => {
    achievement.addToStorage();
    achievement.updateInfoElements();
  });
  syncNewgroundsMedals();
  loadAssets();
  settings.ROUND_PIXELS = true;
  BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;
  BitmapFont.defaultOptions.scaleMode = SCALE_MODES.NEAREST;
  if (settings.RENDER_OPTIONS) {
    settings.RENDER_OPTIONS.hello = false;
  }
  if (getDefinables(InputCollection).size === 0) {
    controlsButtonElement.style.display = "none";
  }
  if (getDefinables(Achievement).size === 0) {
    achievementsButtonElement.style.display = "none";
  }
  updateAchievementsCount();
  achievementsAmountTotalElement.innerText =
    getDefinables(Achievement).size.toString();
  screenElement.appendChild(app.renderer.view);
  app.ticker.add(tick);
  addEventListener("resize", sizeScreen);
  addEventListener("blur", (): void => {
    state.setValues({
      addingKeyboardHeldValue: null,
      didBlur: true,
    });
  });
  addEventListener("contextmenu", (contextmenuEvent: Event): void => {
    contextmenuEvent.preventDefault();
  });
  addEventListener("keydown", (keydownEvent: KeyboardEvent): void => {
    const shouldPreventDirection: boolean =
      document.activeElement === document.getElementById("screen");
    switch (keydownEvent.code) {
      case "ArrowDown":
      case "ArrowLeft":
      case "ArrowRight":
      case "ArrowUp":
        if (shouldPreventDirection) {
          keydownEvent.preventDefault();
        }
        break;
      case "Numpad2":
      case "Numpad4":
      case "Numpad6":
      case "Numpad8":
        if (shouldPreventDirection) {
          if (keydownEvent.getModifierState("NumLock") === false) {
            keydownEvent.preventDefault();
          }
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
        numLock: keydownEvent.getModifierState("NumLock"),
      };
      state.setValues({
        heldKeyboardInputs: [...state.values.heldKeyboardInputs, keyboardInput],
      });
      if (state.values.hasInteracted && assetsAreLoaded()) {
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
      addingKeyboardHeldValue: null,
      heldKeyboardInputs: state.values.heldKeyboardInputs.filter(
        (heldKeyboardInput: KeyboardInput): boolean =>
          heldKeyboardInput.button !== keyupEvent.code,
      ),
    });
  });
  addEventListener("mouseup", (mouseupEvent: MouseEvent): void => {
    switch (mouseupEvent.button) {
      case 3:
      case 4:
        mouseupEvent.preventDefault();
        break;
    }
  });
  addEventListener("error", (errorEvent: ErrorEvent): void => {
    handleUncaughtError(errorEvent.error);
  });
  sizeScreen();
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
        if (state.values.hasInteracted && assetsAreLoaded()) {
          state.setValues({
            pressedMouseInputs: [
              ...state.values.pressedMouseInputs,
              mouseInput,
            ],
          });
        }
      }
      if (mousedownEvent.target instanceof HTMLCanvasElement) {
        state.setValues({
          mouseCoords: {
            x:
              (mousedownEvent.offsetX / mousedownEvent.target.offsetWidth) *
              config.width,
            y:
              (mousedownEvent.offsetY / mousedownEvent.target.offsetHeight) *
              config.height,
          },
        });
      }
      for (const button of getDefinables(Button).values()) {
        button.handleHeld();
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
      if (mouseupEvent.target instanceof HTMLCanvasElement) {
        state.setValues({
          mouseCoords: {
            x:
              (mouseupEvent.offsetX / mouseupEvent.target.offsetWidth) *
              config.width,
            y:
              (mouseupEvent.offsetY / mouseupEvent.target.offsetHeight) *
              config.height,
          },
        });
      }
      for (const button of getDefinables(Button).values()) {
        button.handleUnheld();
      }
    },
  );
  screenElement.addEventListener("mouseleave", (): void => {
    for (const button of getDefinables(Button).values()) {
      button.handleUnheld();
    }
    state.setValues({
      mouseCoords: null,
    });
  });
  screenElement.addEventListener(
    "mousemove",
    (mousemoveEvent: MouseEvent): void => {
      if (mousemoveEvent.target instanceof HTMLCanvasElement) {
        state.setValues({
          mouseCoords: {
            x:
              (mousemoveEvent.offsetX / mousemoveEvent.target.offsetWidth) *
              config.width,
            y:
              (mousemoveEvent.offsetY / mousemoveEvent.target.offsetHeight) *
              config.height,
          },
        });
      }
    },
  );
  screenElement.addEventListener("selectstart", (e: Event): void => {
    e.preventDefault();
  });
  screenElement.addEventListener("touchcancel", (): void => {
    for (const button of getDefinables(Button).values()) {
      button.handleUnheld();
    }
    state.setValues({
      mouseCoords: null,
    });
  });
  screenElement.addEventListener("touchend", (e: TouchEvent): void => {
    e.preventDefault();
    for (const button of getDefinables(Button).values()) {
      button.handleUnheld();
    }
    state.setValues({
      mouseCoords: null,
    });
  });
  screenElement.addEventListener("touchmove", (e: TouchEvent): void => {
    e.preventDefault();
    if (e.target instanceof HTMLCanvasElement) {
      const scale: number = getStretchScale();
      const rect: DOMRect = e.target.getBoundingClientRect();
      const targetTouch: Touch | undefined = e.targetTouches[0];
      if (typeof targetTouch === "undefined") {
        throw new Error("Target touch is undefined.");
      }
      state.setValues({
        mouseCoords: {
          x: (targetTouch.clientX - rect.x) / scale,
          y: (targetTouch.clientY - rect.y) / scale,
        },
      });
    }
  });
  screenElement.addEventListener("touchstart", (e: TouchEvent): void => {
    e.preventDefault();
    if (e.target instanceof HTMLCanvasElement) {
      const scale: number = getStretchScale();
      const rect: DOMRect = e.target.getBoundingClientRect();
      const targetTouch: Touch | undefined = e.targetTouches[0];
      if (typeof targetTouch === "undefined") {
        throw new Error("Target touch is undefined.");
      }
      state.setValues({
        mouseCoords: {
          x: (targetTouch.clientX - rect.x) / scale,
          y: (targetTouch.clientY - rect.y) / scale,
        },
      });
    }
    for (const button of getDefinables(Button).values()) {
      button.handleHeld();
    }
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
    volumeTestHowl.volume(
      (mainVolumeSliderInputElement as HTMLInputElement).valueAsNumber / 100,
    );
    volumeTestHowl.play();
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
  screenshotButtonElement.addEventListener("click", (): void => {
    takeScreenshot();
  });
  controlsButtonElement.addEventListener("click", (): void => {
    goToPauseMenuSection("controls");
  });
  achievementsButtonElement.addEventListener("click", (): void => {
    goToPauseMenuSection("achievements");
  });
  for (const pauseBackButtonElement of pauseBackButtonElements) {
    pauseBackButtonElement.addEventListener("click", (): void => {
      goToPauseMenuSection("main");
    });
  }
  controlsResetButtonElement.addEventListener("click", (): void => {
    const bodyElement: HTMLElement = document.createElement("p");
    bodyElement.innerText = "Are you sure you want to reset all inputs?";
    fireAlert({
      bodyElement,
      onConfirm: (): void => {
        getDefinables(InputCollection).forEach(
          (inputCollection: InputCollection): void => {
            inputCollection.resetToDefault();
          },
        );
      },
      showCancelButton: true,
      showConfirmButton: true,
      title: "Reset inputs",
    });
  });
  addInputBodyBoxElement.addEventListener(
    "keydown",
    (keyboardEvent: KeyboardEvent): void => {
      keyboardEvent.stopImmediatePropagation();
      keyboardEvent.preventDefault();
      if (
        state.values.addingKeyboardHeldValue === null ||
        state.values.addingKeyboardValue !== null
      ) {
        addInputBodyBoxTextElement.innerText = `Keyboard: ${keyboardEvent.code}`;
        state.setValues({
          addingGamepadValue: null,
          addingKeyboardHeldValue: keyboardEvent.code,
          addingKeyboardValue: keyboardEvent.code,
          addingMouseValue: null,
        });
        addInputBodyNumlockWithElement.style.display = "flex";
        addInputBodyNumlockWithoutElement.style.display = "flex";
        addInputBodyNumlockWithInputElement.checked = true;
        addInputBodyNumlockWithoutInputElement.checked = true;
      }
    },
  );
  addInputBodyBoxElement.addEventListener(
    "mousedown",
    (mouseEvent: MouseEvent): void => {
      addInputBodyBoxTextElement.innerText = `Mouse: ${mouseEvent.button}`;
      state.setValues({
        addingGamepadValue: null,
        addingKeyboardValue: null,
        addingMouseValue: mouseEvent.button,
      });
      addInputBodyNumlockWithElement.style.display = "none";
      addInputBodyNumlockWithoutElement.style.display = "none";
    },
  );
  addInputBodyNumlockWithInputElement.addEventListener("change", (): void => {
    addInputBodyBoxElement.focus();
  });
  addInputBodyNumlockWithoutInputElement.addEventListener(
    "change",
    (): void => {
      addInputBodyBoxElement.focus();
    },
  );
};
