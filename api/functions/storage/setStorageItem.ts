import { getPrefixedProperty } from "./getPrefixedProperty";
import { storage } from "../../storage";

export const setStorageItem = (property: string, value: unknown): void => {
  const prefixedProperty: string = getPrefixedProperty(property);
  try {
    localStorage.setItem(prefixedProperty, JSON.stringify(value));
  } catch {
    storage.set(prefixedProperty, JSON.stringify(value));
  }
};
