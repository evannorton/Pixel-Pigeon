import { Application } from "pixi.js";
import { Config } from "./types/Config";
import { Dev } from "./types/Dev";
import { Howl } from "howler";
import { State } from "./classes/State";
import { World } from "./types/World";

interface StateSchema {
  readonly app: Application | null;
  readonly cameraLockedEntityID: string | null;
  readonly config: Config | null;
  readonly currentTime: number;
  readonly dev: Dev | null;
  readonly hasDoneInputPressForTick: boolean;
  readonly hasExecutedOnRunCallbacks: boolean;
  readonly hasInteracted: boolean;
  readonly heldGamepadButtons: number[];
  readonly heldKeys: string[];
  readonly isInitialized: boolean;
  readonly levelID: string | null;
  readonly loadedAssets: number;
  readonly onRunCallbacks: (() => void)[];
  readonly onTickCallbacks: (() => void)[];
  readonly pauseMenuCondition: (() => boolean) | null;
  readonly pauseMenuPausedAudioSourceIDs: string[];
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
  hasDoneInputPressForTick: false,
  hasExecutedOnRunCallbacks: false,
  hasInteracted: false,
  heldGamepadButtons: [],
  heldKeys: [],
  isInitialized: false,
  levelID: null,
  loadedAssets: 0,
  onRunCallbacks: [],
  onTickCallbacks: [],
  pauseMenuCondition: null,
  pauseMenuPausedAudioSourceIDs: [],
  volumeTestHowl,
  world: null,
});
volumeTestHowl.on("load", (): void => {
  state.setValues({
    loadedAssets: state.values.loadedAssets + 1,
  });
});
