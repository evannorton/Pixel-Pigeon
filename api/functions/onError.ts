import { state } from "../state";

export const onError = (callback: (error: unknown) => void): void => {
  state.setValues({
    onErrorCallbacks: [...state.values.onErrorCallbacks, callback],
  });
};
