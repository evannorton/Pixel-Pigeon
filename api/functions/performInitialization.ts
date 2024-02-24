import { Achievement } from "../classes/Achievement";
import { Application, BaseTexture, SCALE_MODES, settings } from "pixi.js";
import { AudioSource } from "../classes/AudioSource";
import { Config } from "../types/Config";
import { Dev } from "../types/Dev";
import { Env } from "../types/Env";
import { ImageSource } from "../classes/ImageSource";
import { InputCollection } from "../classes/InputCollection";
import { KeyboardButton } from "../types/KeyboardButton";
import { KeyboardInput } from "../types/KeyboardInput";
import { LDTK } from "../types/LDTK";
import { MouseInput } from "../types/MouseInput";
import {
  addInputBodyElement,
  addInputBodyTextElement,
} from "../elements/addInputBodyElement";
import { assetsAreLoaded } from "./assetsAreLoaded";
import { cleanStorage } from "./storage/cleanStorage";
import { fireAlert } from "./fireAlert";
import { getDefinable } from "./getDefinable";
import { getDefinables } from "./getDefinables";
import { goToPauseMenuSection } from "./goToPauseMenuSection";
import { handleUncaughtError } from "./handleUncaughtError";
import { loadAssets } from "./loadAssets";
import { sizeScreen } from "./sizeScreen";
import { state } from "../state";
import { syncNewgroundsMedals } from "./syncNewgroundsMedals";
import { takeScreenshot } from "./takeScreenshot";
import { tick } from "./tick";
import { updateAchievementsCount } from "./updateAchievementsCount";

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
  const devRes: Response = await fetch("./pp-dev.json");
  const dev: Dev | null = devRes.ok ? ((await devRes.json()) as Dev) : null;
  const configRes: Response = await fetch("./pp-config.json");
  const config: Config = (await configRes.json()) as Config;
  const ldtkRes: Response = await fetch("./project.ldtk");
  const ldtk: LDTK = (await ldtkRes.json()) as LDTK;
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
  const app: Application = new Application({
    height: config.height,
    width: config.width,
  });
  state.setValues({
    app,
    config,
    dev,
    env,
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
  addInputBodyElement.appendChild(addInputBodyTextElement);
  screenElement.appendChild(app.view as HTMLCanvasElement);
  app.ticker.add(tick);
  addEventListener("resize", sizeScreen);
  addEventListener("blur", (): void => {
    state.setValues({
      didBlur: true,
    });
  });
  addEventListener("contextmenu", (contextmenuEvent: Event): void => {
    contextmenuEvent.preventDefault();
  });
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
  addEventListener("mouseup", (mousedownEvent: MouseEvent): void => {
    switch (mousedownEvent.button) {
      case 3:
      case 4:
        mousedownEvent.preventDefault();
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
  addInputBodyElement.addEventListener(
    "keydown",
    (keyboardEvent: KeyboardEvent): void => {
      if (state.values.addInputCollectionID === null) {
        throw new Error(
          "An attempt was made to add a keyboard input with no add input collection ID.",
        );
      }
      keyboardEvent.preventDefault();
      addInputBodyTextElement.innerText = `Keyboard: ${keyboardEvent.code}`;
      const inputCollection: InputCollection | null = getDefinable(
        InputCollection,
        state.values.addInputCollectionID,
      );
      const keyboardButton: KeyboardButton = {
        numlock: false,
        value: keyboardEvent.code,
        withoutNumlock: false,
      };
      inputCollection.updateAddingKeyboardButton(keyboardButton);
    },
  );
  addInputBodyElement.addEventListener(
    "mousedown",
    (mouseEvent: MouseEvent): void => {
      if (state.values.addInputCollectionID === null) {
        throw new Error(
          "An attempt was made to add a mouse input with no add input collection ID.",
        );
      }
      addInputBodyTextElement.innerText = `Mouse: ${mouseEvent.button}`;
      const inputCollection: InputCollection | null = getDefinable(
        InputCollection,
        state.values.addInputCollectionID,
      );
      inputCollection.updateAddingMouseButton(mouseEvent.button);
    },
  );
};
