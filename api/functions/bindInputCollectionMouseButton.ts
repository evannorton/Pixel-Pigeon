import { InputCollection } from "../classes/InputCollection";
import { definableExists, getDefinable } from "definables";

export interface BindInputCollectionMouseButtonOptions {
  inputCollectionID: string;
  value: number;
}
export const bindInputCollectionMouseButton = (
  options: BindInputCollectionMouseButtonOptions,
): void => {
  if (Number.isInteger(options.value) === false || options.value < 0) {
    throw new Error(`Mouse button "${options.value}" is invalid.`);
  }
  if (definableExists(InputCollection, options.inputCollectionID) === false) {
    throw new Error(
      `InputCollection "${options.inputCollectionID}" does not exist.`,
    );
  }
  getDefinable(InputCollection, options.inputCollectionID).bindMouseButton(
    options.value,
  );
};
