import State from "./classes/State";

interface Schema {
  readonly currentTime: number;
  readonly gamepads: Gamepad[];
  readonly hasInteracted: boolean;
  readonly heldGamepadButtons: number[];
  readonly heldKeys: string[];
  readonly loadedAssets: number;
}

const state = new State<Schema>({
  currentTime: 0,
  gamepads: [],
  hasInteracted: false,
  heldGamepadButtons: [],
  heldKeys: [],
  loadedAssets: 0,
});

export default state;
