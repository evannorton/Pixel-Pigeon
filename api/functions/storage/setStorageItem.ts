import { getPrefixedStorageKey } from "./getPrefixedStorageKey";
import { state } from "../../state";
import { storage } from "../../storage";
import { store } from "./store";

export const setStorageItem = (
  property: string,
  value: Exclude<unknown, undefined>,
): void => {
  if (state.values.gameID !== null) {
    const prefixedProperty: string = getPrefixedStorageKey(property);
    try {
      localStorage.setItem(prefixedProperty, JSON.stringify(value));
    } catch {
      storage.set(prefixedProperty, JSON.stringify(value));
    }
  } else {
    store.set(property, value);
  }
};
