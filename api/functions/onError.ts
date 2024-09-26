import { state } from "../state";

export const onError = (callback: () => void): void => {
  state.setValues({
    onErrorCallbacks: [...state.values.onErrorCallbacks, callback],
  });
};
