import { InputCollection } from "../classes/InputCollection";
import { definableExists, getDefinable } from "definables";

export interface ResetInputCollectionOptions {
  inputCollectionID: string;
}
export const resetInputCollection = (
  options: ResetInputCollectionOptions,
): void => {
  if (definableExists(InputCollection, options.inputCollectionID) === false) {
    throw new Error(
      `InputCollection "${options.inputCollectionID}" does not exist.`,
    );
  }
  getDefinable(InputCollection, options.inputCollectionID).resetToDefault();
};
