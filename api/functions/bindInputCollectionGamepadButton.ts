import { InputCollection } from "../classes/InputCollection";
import { definableExists, getDefinable } from "definables";

export interface BindInputCollectionGamepadButtonOptions {
  inputCollectionID: string;
  value: number;
}
export const bindInputCollectionGamepadButton = (
  options: BindInputCollectionGamepadButtonOptions,
): void => {
  if (Number.isInteger(options.value) === false || options.value < 0) {
    throw new Error(`Gamepad button "${options.value}" is invalid.`);
  }
  if (definableExists(InputCollection, options.inputCollectionID) === false) {
    throw new Error(
      `InputCollection "${options.inputCollectionID}" does not exist.`,
    );
  }
  getDefinable(InputCollection, options.inputCollectionID).bindGamepadButton(
    options.value,
  );
};
