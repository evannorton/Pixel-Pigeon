import { state } from "../state";

export const onTick = (callback: () => void): void => {
  state.setValues({
    onTickCallbacks: [...state.values.onTickCallbacks, callback],
  });
};
