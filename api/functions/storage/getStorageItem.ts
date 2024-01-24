import { getPrefixedStorageKey } from "./getPrefixedStorageKey";
import { state } from "../../state";
import { storage } from "../../storage";
import { store } from "./store";

export const getStorageItem = (
  property: string,
): Exclude<unknown, undefined> => {
  if (state.values.gameID !== null) {
    const prefixedProperty: string = getPrefixedStorageKey(property);
    try {
      const item: string | null = localStorage.getItem(prefixedProperty);
      if (item !== null) {
        return JSON.parse(item);
      }
    } catch {
      const value: string | undefined = storage.get(prefixedProperty);
      if (typeof value !== "undefined") {
        return JSON.parse(value);
      }
    }
  } else {
    const value: unknown = store.get(property);
    if (typeof value !== "undefined") {
      return value;
    }
  }
  return null;
};
