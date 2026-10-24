import { InputCollection } from "../classes/InputCollection";
import { NumLock } from "../types/NumLock";
import { definableExists, getDefinable } from "definables";

export interface BindInputCollectionKeyboardButtonOptions {
  inputCollectionID: string;
  numLock: NumLock;
  value: string;
}
const isNumLock = (numLock: NumLock): boolean =>
  numLock === NumLock.Default ||
  numLock === NumLock.With ||
  numLock === NumLock.Without;

export const bindInputCollectionKeyboardButton = (
  options: BindInputCollectionKeyboardButtonOptions,
): void => {
  if (isNumLock(options.numLock) === false) {
    throw new Error(`Num lock "${options.numLock}" is invalid.`);
  }
  if (options.value.length === 0) {
    throw new Error("Keyboard button value is empty.");
  }
  if (definableExists(InputCollection, options.inputCollectionID) === false) {
    throw new Error(
      `InputCollection "${options.inputCollectionID}" does not exist.`,
    );
  }
  getDefinable(InputCollection, options.inputCollectionID).bindKeyboardButton({
    numLock: options.numLock,
    value: options.value,
  });
};
