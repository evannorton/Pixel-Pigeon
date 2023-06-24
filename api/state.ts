import State from "./classes/State";

interface StateSchema {
  readonly currentTime: number;
  readonly hasInteracted: boolean;
  readonly heldGamepadButtons: number[];
  readonly heldKeys: string[];
  readonly isInitialized: boolean;
  readonly loadedAssets: number;
}
const state: State<StateSchema> = new State<StateSchema>({
  currentTime: 0,
  hasInteracted: false,
  heldGamepadButtons: [],
  heldKeys: [],
  isInitialized: false,
  loadedAssets: 0,
});

export default state;
