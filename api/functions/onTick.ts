import { state } from "pigeon-mode-game-framework/api/state";

export const onTick = (callback: () => void): void => {
  state.setValues({
    onTickCallbacks: [...state.values.onTickCallbacks, callback],
  });
};
