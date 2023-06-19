import State from "./classes/State";

interface Schema {
  readonly currentTime: number;
  readonly hasInteracted: boolean;
  readonly heldKeys: string[];
  readonly loadedAssets: number;
}

const state = new State<Schema>({
  currentTime: 0,
  hasInteracted: false,
  heldKeys: [],
  loadedAssets: 0,
});

export default state;
