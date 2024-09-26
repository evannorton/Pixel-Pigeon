import { state } from "../state";

export const onError = (callback: (error: Error) => void): void => {
  state.setValues({
    onErrorCallbacks: [...state.values.onErrorCallbacks, callback],
  });
};
