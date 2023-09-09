import { state } from "../state";

/**
 * Function adds any callbacks to a list of callbacks that are called every tick
 * @param callback - Callback to be added to the list of functions that are called every tick
 */
export const onTick = (callback: () => void): void => {
  state.setValues({
    onTickCallbacks: [...state.values.onTickCallbacks, callback],
  });
};
