import { assetsAreLoaded } from "./assetsAreLoaded";
import { getWorld } from "./getWorld";
import { state } from "../state";

export const attemptGetWorld = (): void => {
  if (assetsAreLoaded()) {
    state.setValues({
      world: getWorld(),
    });
  }
};
