import { Application } from "pixi.js";
import { Config } from "./types/Config";
import { Dev } from "./types/Dev";
import { GamepadInput } from "./types/GamepadInput";
import { Howl } from "howler";
import { KeyboardInput } from "./types/KeyboardInput";
import { MouseInput } from "./types/MouseInput";
import { State } from "./classes/State";
import { World } from "./types/World";

interface StateSchema {
  readonly app: Application | null;
  readonly cameraLockedEntityID: string | null;
  readonly config: Config | null;
  readonly currentTime: number;
  readonly dev: Dev | null;
  readonly didBlur: boolean;
  readonly hasExecutedOnRunCallbacks: boolean;
  readonly hasInteracted: boolean;
  readonly heldGamepadInputs: GamepadInput[];
  readonly heldKeyboardInputs: KeyboardInput[];
  readonly heldMouseInputs: MouseInput[];
  readonly isInitialized: boolean;
  readonly levelID: string | null;
  readonly loadedAssets: number;
  readonly onRunCallbacks: (() => void)[];
  readonly onTickCallbacks: (() => void)[];
  readonly pauseMenuCondition: (() => boolean) | null;
  readonly pauseMenuPausedAudioSourceIDs: string[];
  readonly pressedGamepadInputs: GamepadInput[];
  readonly pressedKeyboardInputs: KeyboardInput[];
  readonly pressedMouseInputs: MouseInput[];
  readonly volumeTestHowl: Howl;
  readonly world: World | null;
}
const volumeTestHowl: Howl = new Howl({
  autoplay: false,
  loop: false,
  preload: true,
  src: ["mp3/volume-test.mp3"],
  volume: 0.5,
});

export const state: State<StateSchema> = new State<StateSchema>({
  app: null,
  cameraLockedEntityID: null,
  config: null,
  currentTime: 0,
  dev: null,
  didBlur: false,
  hasExecutedOnRunCallbacks: false,
  hasInteracted: false,
  heldGamepadInputs: [],
  heldKeyboardInputs: [],
  heldMouseInputs: [],
  isInitialized: false,
  levelID: null,
  loadedAssets: 0,
  onRunCallbacks: [],
  onTickCallbacks: [],
  pauseMenuCondition: null,
  pauseMenuPausedAudioSourceIDs: [],
  pressedGamepadInputs: [],
  pressedKeyboardInputs: [],
  pressedMouseInputs: [],
  volumeTestHowl,
  world: null,
});
volumeTestHowl.on("load", (): void => {
  state.setValues({
    loadedAssets: state.values.loadedAssets + 1,
  });
});
