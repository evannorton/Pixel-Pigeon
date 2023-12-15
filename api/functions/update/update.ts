import { Anchor } from "../../classes/Anchor";
import { Sprite } from "../../classes/Sprite";
import { getDefinables } from "../getDefinables";
import { handleCaughtError } from "../handleCaughtError";
import { state } from "../../state";
import { updateInput } from "./updateInput";
import { updateLevel } from "./updateLevel";

export const update = (): void => {
  updateInput();
  if (!state.values.hasExecutedOnRunCallbacks) {
    for (const onRunCallback of state.values.onRunCallbacks) {
      try {
        onRunCallback();
      } catch (error: unknown) {
        handleCaughtError(error, "onRun");
      }
    }
    state.setValues({ hasExecutedOnRunCallbacks: true });
  }
  if (state.values.levelID !== null) {
    updateLevel();
  }
  for (const onTickCallback of state.values.onTickCallbacks) {
    try {
      onTickCallback();
    } catch (error: unknown) {
      handleCaughtError(error, "onTick");
    }
  }
  getDefinables(Sprite).forEach((sprite: Sprite): void => {
    sprite.playAnimation();
    sprite.drawAtCoordinates();
  });
  getDefinables(Anchor).forEach((anchor: Anchor): void => {
    anchor.update();
  });
  if (
    state.values.pauseMenuCondition !== null &&
    state.values.pauseMenuCondition()
  ) {
    document.body.classList.add("pausable");
  } else {
    document.body.classList.remove("pausable");
  }
};
