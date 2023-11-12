import { getPrefixedProperty } from "./getPrefixedProperty";
import { storage } from "../../storage";

export const getStorageItem: (property: string) => unknown = (
  property: string,
): unknown => {
  const prefixedProperty: string = getPrefixedProperty(property);
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
  return null;
};
