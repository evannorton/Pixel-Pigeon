import { InputCollection } from "../classes/InputCollection";
import { KeyboardButton } from "../types/KeyboardButton";
import { getDefinables } from "definables";

export interface InputCollectionSnapshot {
  readonly gamepadButtons: readonly number[];
  readonly id: string;
  readonly joystickDirections: readonly ("down" | "left" | "right" | "up")[];
  readonly keyboardButtons: readonly KeyboardButton[];
  readonly matchesDefaultInputs: boolean;
  readonly mouseButtons: readonly number[];
  readonly name: string;
}
export const getInputCollections = (): readonly InputCollectionSnapshot[] => {
  const inputCollections: InputCollectionSnapshot[] = [];
  for (const inputCollection of getDefinables(InputCollection).values()) {
    inputCollections.push({
      gamepadButtons: [...inputCollection.gamepadButtons],
      id: inputCollection.id,
      joystickDirections: [...inputCollection.joystickDirections],
      keyboardButtons: inputCollection.keyboardButtons.map(
        (keyboardButton: KeyboardButton): KeyboardButton => ({
          numLock: keyboardButton.numLock,
          value: keyboardButton.value,
        }),
      ),
      matchesDefaultInputs: inputCollection.matchesDefaultInputs(),
      mouseButtons: [...inputCollection.mouseButtons],
      name: inputCollection.name,
    });
  }
  return inputCollections;
};
