import { SpriteInstance } from "../../classes/SpriteInstance";
import { getDefinables } from "../getDefinables";
import { state } from "../../state";
import { updateInput } from "./updateInput";
import { updateLevel } from "./updateLevel";

export const update = (): void => {
  updateInput();
  if (!state.values.hasExecutedOnRunCallbacks) {
    for (const onRunCallback of state.values.onRunCallbacks) {
      onRunCallback();
    }
    state.setValues({ hasExecutedOnRunCallbacks: true });
  }
  if (state.values.levelID !== null) {
    updateLevel();
  }
  for (const onTickCallback of state.values.onTickCallbacks) {
    onTickCallback();
  }
  getDefinables(SpriteInstance).forEach(
    (spriteInstance: SpriteInstance): void => {
      spriteInstance.playAnimation();
      spriteInstance.drawAtCoordinates();
    },
  );
  if (
    state.values.pauseMenuCondition !== null &&
    state.values.pauseMenuCondition()
  ) {
    document.body.classList.add("pausable");
  } else {
    document.body.classList.remove("pausable");
  }
};
