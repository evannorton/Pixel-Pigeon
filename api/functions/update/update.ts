import { Button } from "../../classes/Button";
import { Sprite } from "../../classes/Sprite";
import { getDefinables } from "../getDefinables";
import { handleCaughtError } from "../handleCaughtError";
import { state } from "../../state";
import { updateInput } from "./updateInput";
import { updateLevel } from "./updateLevel";

export const update = (): void => {
  getDefinables(Button).forEach((button: Button): void => {
    button.update();
  });
  updateInput();
  if (!state.values.hasExecutedOnRunCallbacks) {
    for (const onRunCallback of state.values.onRunCallbacks) {
      try {
        onRunCallback();
      } catch (error: unknown) {
        handleCaughtError(error, "onRun", true);
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
      handleCaughtError(error, "onTick", true);
    }
  }
  getDefinables(Sprite).forEach((sprite: Sprite): void => {
    sprite.playAnimation();
    sprite.drawAtCoordinates();
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
