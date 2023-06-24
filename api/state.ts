import Ogmo from "pigeon-mode-game-library/api/interfaces/Ogmo";
import State from "./classes/State";

interface Schema {
  readonly currentTime: number;
  readonly hasInteracted: boolean;
  readonly heldGamepadButtons: number[];
  readonly heldKeys: string[];
  readonly ogmo: Ogmo | null;
  readonly loadedAssets: number;
}

const state = new State<Schema>({
  currentTime: 0,
  hasInteracted: false,
  heldGamepadButtons: [],
  heldKeys: [],
  loadedAssets: 0,
  ogmo: null,
});

export default state;
