import { Application, BitmapText, Graphics } from "pixi.js";
import { Config } from "./types/Config";
import { Dev } from "./types/Dev";
import { Env } from "./types/Env";
import { GamepadInput } from "./types/GamepadInput";
import { Howl } from "howler";
import { KeyboardInput } from "./types/KeyboardInput";
import { LDTK } from "./types/LDTK";
import { MouseInput } from "./types/MouseInput";
import { State } from "./classes/State";
import { World } from "./types/World";
import { attemptGetWorld } from "./functions/attemptGetWorld";
import { defaultVolume } from "./constants/defaultVolume";

interface StateSchema {
  readonly achievementUnlockRenderedAt: number | null;
  readonly addingKeyboardValue: string | null;
  readonly addingMouseValue: number | null;
  readonly app: Application | null;
  readonly addInputCollectionID: string | null;
  readonly cameraLockedEntityID: string | null;
  readonly config: Config | null;
  readonly currentTime: number;
  readonly dev: Dev | null;
  readonly didBlur: boolean;
  readonly env: Env | null;
  readonly gameID: string | null;
  readonly hasErrored: boolean;
  readonly hasExecutedOnRunCallbacks: boolean;
  readonly hasInteracted: boolean;
  readonly heldGamepadInputs: GamepadInput[];
  readonly heldKeyboardInputs: KeyboardInput[];
  readonly heldMouseInputs: MouseInput[];
  readonly isInitialized: boolean;
  readonly ldtk: LDTK | null;
  readonly levelID: string | null;
  readonly loadedAssets: number;
  readonly onRunCallbacks: (() => void)[];
  readonly onTickCallbacks: (() => void)[];
  readonly pauseMenuCondition: (() => boolean) | null;
  readonly pauseMenuPausedAudioSourceIDs: string[];
  readonly pressedGamepadInputs: GamepadInput[];
  readonly pressedKeyboardInputs: KeyboardInput[];
  readonly pressedMouseInputs: MouseInput[];
  readonly renderChildrenToDestroy: (BitmapText | Graphics)[];
  readonly type: string | null;
  readonly volumeTestHowl: Howl;
  readonly world: World | null;
}
const volumeTestHowl: Howl = new Howl({
  autoplay: false,
  loop: false,
  preload: true,
  src: ["mp3/volume-test.mp3"],
  volume: defaultVolume,
});

export const state: State<StateSchema> = new State<StateSchema>({
  achievementUnlockRenderedAt: null,
  addInputCollectionID: null,
  addingKeyboardValue: null,
  addingMouseValue: null,
  app: null,
  cameraLockedEntityID: null,
  config: null,
  currentTime: 0,
  dev: null,
  didBlur: false,
  env: null,
  gameID: null,
  hasErrored: false,
  hasExecutedOnRunCallbacks: false,
  hasInteracted: false,
  heldGamepadInputs: [],
  heldKeyboardInputs: [],
  heldMouseInputs: [],
  isInitialized: false,
  ldtk: null,
  levelID: null,
  loadedAssets: 0,
  onRunCallbacks: [],
  onTickCallbacks: [],
  pauseMenuCondition: null,
  pauseMenuPausedAudioSourceIDs: [],
  pressedGamepadInputs: [],
  pressedKeyboardInputs: [],
  pressedMouseInputs: [],
  renderChildrenToDestroy: [],
  type: null,
  volumeTestHowl,
  world: null,
});
volumeTestHowl.on("load", (): void => {
  state.setValues({
    loadedAssets: state.values.loadedAssets + 1,
  });
  attemptGetWorld();
});
