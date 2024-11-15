import { HUDElementReferences } from "../types/HUDElementReferences";

export const mergeHUDElementReferences = (
  hudElementReferences: readonly HUDElementReferences[],
): HUDElementReferences => {
  const merged: Record<string, unknown[] | undefined> = {};
  for (const singleHUDElementReferences of hudElementReferences) {
    Object.keys(singleHUDElementReferences).forEach((key: string): void => {
      const value: unknown[] | undefined = merged[key];
      if (typeof value === "undefined") {
        merged[key] = [];
      }
      const updatedValue: unknown[] | undefined = merged[key];
      if (typeof updatedValue !== "undefined") {
        merged[key] = [
          ...updatedValue,
          ...((singleHUDElementReferences as Record<string, unknown[]>)[
            key
          ] as unknown[]),
        ];
      }
    });
  }
  return merged as HUDElementReferences;
};
