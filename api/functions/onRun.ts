import { state } from "../state";

export const onRun = (callback: () => void): void => {
  state.setValues({
    onRunCallbacks: [...state.values.onRunCallbacks, callback],
  });
};
