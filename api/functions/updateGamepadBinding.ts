import {
  addInputBodyBoxElement,
  addInputBodyBoxTextElement,
  addInputBodyNumlockWithElement,
  addInputBodyNumlockWithoutElement,
} from "../elements/addInputBodyElement";
import { getGamepads } from "./getGamepads";
import { state } from "../state";

export const updateGamepadBinding = (): void => {
  if (document.activeElement === addInputBodyBoxElement) {
    const heldValues: number[] = [];
    getGamepads().forEach((gamepad: Gamepad): void => {
      gamepad.buttons.forEach(
        (gamepadButton: GamepadButton, gamepadButtonIndex: number): void => {
          if (gamepadButton.pressed && gamepadButton.value === 1) {
            heldValues.push(gamepadButtonIndex);
          }
        },
      );
    });
    const pressedValues: number[] = heldValues.filter(
      (value: number): boolean =>
        state.values.addingGamepadHeldValues.includes(value) === false,
    );
    const pressedValue: number | null =
      (pressedValues[0] as number | undefined) ?? null;
    if (pressedValue !== null) {
      addInputBodyBoxTextElement.innerText = `Gamepad: ${pressedValue}`;
      state.setValues({
        addingGamepadValue: pressedValue,
        addingKeyboardValue: null,
        addingMouseValue: null,
      });
      addInputBodyNumlockWithElement.style.display = "none";
      addInputBodyNumlockWithoutElement.style.display = "none";
    }
    state.setValues({ addingGamepadHeldValues: heldValues });
  }
};
