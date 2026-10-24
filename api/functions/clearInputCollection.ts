import { InputCollection } from "../classes/InputCollection";
import { definableExists, getDefinable } from "definables";

export interface ClearInputCollectionOptions {
  inputCollectionID: string;
}
export const clearInputCollection = (
  options: ClearInputCollectionOptions,
): void => {
  if (definableExists(InputCollection, options.inputCollectionID) === false) {
    throw new Error(
      `InputCollection "${options.inputCollectionID}" does not exist.`,
    );
  }
  getDefinable(InputCollection, options.inputCollectionID).clearInputs();
};
