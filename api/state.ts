import { Application, BitmapText, Graphics } from "pixi.js";
import { Config } from "./types/Config";
import { Dev } from "./types/Dev";
import { Env } from "./types/Env";
import { GamepadInput } from "./types/GamepadInput";
import { KeyboardInput } from "./types/KeyboardInput";
import { LDTK } from "./types/LDTK";
import { MouseCoords } from "./types/MouseCoords";
import { MouseInput } from "./types/MouseInput";
import { Socket } from "socket.io-client";
import { State } from "./classes/State";
import { World } from "./types/World";
import { attemptGetWorld } from "./functions/attemptGetWorld";
import { volumeTestHowl } from "./howls/volumeTestHowl";

interface StateSchema {
  readonly achievementUnlockRenderedAt: number | null;
  readonly addInputCollectionID: string | null;
  readonly addingGamepadHeldValues: number[];
  readonly addingGamepadValue: number | null;
  readonly addingKeyboardHeldValue: string | null;
  readonly addingKeyboardValue: string | null;
  readonly addingMouseValue: number | null;
  readonly app: Application<HTMLCanvasElement> | null;
  readonly cameraLockedEntityID: string | null;
  readonly config: Config | null;
  readonly currentTime: number;
  readonly dev: Dev | null;
  readonly didBlur: boolean;
  readonly env: Env | null;
  readonly gameEnv: Record<string, unknown> | null;
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
  readonly mouseCoords: MouseCoords | null;
  readonly onErrorCallbacks: ((error: Error) => void)[];
  readonly onRunCallbacks: (() => void)[];
  readonly onTickCallbacks: (() => void)[];
  readonly pauseMenuCondition: (() => boolean) | null;
  readonly pauseMenuPausedAudioSourceIDs: string[];
  readonly pressedGamepadInputs: GamepadInput[];
  readonly pressedKeyboardInputs: KeyboardInput[];
  readonly pressedMouseInputs: MouseInput[];
  readonly releasedGamepadInputs: GamepadInput[];
  readonly releasedKeyboardInputs: KeyboardInput[];
  readonly releasedMouseInputs: MouseInput[];
  readonly renderChildrenToDestroy: (BitmapText | Graphics)[];
  readonly socket: Socket | null;
  readonly type: string | null;
  readonly world: World | null;
}

export const state: State<StateSchema> = new State<StateSchema>({
  achievementUnlockRenderedAt: null,
  addInputCollectionID: null,
  addingGamepadHeldValues: [],
  addingGamepadValue: null,
  addingKeyboardHeldValue: null,
  addingKeyboardValue: null,
  addingMouseValue: null,
  app: null,
  cameraLockedEntityID: null,
  config: null,
  currentTime: 0,
  dev: null,
  didBlur: false,
  env: null,
  gameEnv: null,
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
  mouseCoords: null,
  onErrorCallbacks: [],
  onRunCallbacks: [],
  onTickCallbacks: [],
  pauseMenuCondition: null,
  pauseMenuPausedAudioSourceIDs: [],
  pressedGamepadInputs: [],
  pressedKeyboardInputs: [],
  pressedMouseInputs: [],
  releasedGamepadInputs: [],
  releasedKeyboardInputs: [],
  releasedMouseInputs: [],
  renderChildrenToDestroy: [],
  socket: null,
  type: null,
  world: null,
});
volumeTestHowl.on("load", (): void => {
  state.setValues({
    loadedAssets: state.values.loadedAssets + 1,
  });
  attemptGetWorld();
});
