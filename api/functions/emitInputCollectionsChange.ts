import { state } from "../state";

let isInputCollectionsChangeQueued: boolean = false;

export const emitInputCollectionsChange = (): void => {
  if (isInputCollectionsChangeQueued === false) {
    isInputCollectionsChangeQueued = true;
    queueMicrotask((): void => {
      isInputCollectionsChangeQueued = false;
      const onInputCollectionsChangeCallbacks: readonly (() => void)[] =
        state.values.onInputCollectionsChangeCallbacks;
      for (const onInputCollectionsChangeCallback of onInputCollectionsChangeCallbacks) {
        onInputCollectionsChangeCallback();
      }
    });
  }
};
export const onInputCollectionsChange = (callback: () => void): void => {
  state.setValues({
    onInputCollectionsChangeCallbacks: [
      ...state.values.onInputCollectionsChangeCallbacks,
      callback,
    ],
  });
};
