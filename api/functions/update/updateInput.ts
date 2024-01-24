import { GamepadInput } from "../../types/GamepadInput";
import { InputPressHandler } from "../../classes/InputPressHandler";
import { InputTickHandler } from "../../classes/InputTickHandler";
import { getDefinables } from "../getDefinables";
import { handleCaughtError } from "../handleCaughtError";
import { state } from "../../state";

export const updateInput = (): void => {
  if (state.values.didBlur) {
    state.setValues({
      heldGamepadInputs: [],
      heldKeyboardInputs: [],
      heldMouseInputs: [],
    });
    getDefinables(InputTickHandler).forEach(
      (inputTickHandler: InputTickHandler<string>): void => {
        inputTickHandler.empty();
      },
    );
  }
  if (typeof navigator.getGamepads === "function") {
    const gamepads: (Gamepad | null)[] = navigator.getGamepads();
    if (typeof gamepads.forEach === "function") {
      gamepads.forEach((gamepad: Gamepad | null): void => {
        if (gamepad) {
          gamepad.buttons.forEach(
            (button: GamepadButton, buttonIndex: number): void => {
              if (
                !state.values.heldGamepadInputs.some(
                  (heldGamepadInput: GamepadInput): boolean =>
                    heldGamepadInput.button === buttonIndex,
                ) &&
                Boolean(button.pressed)
              ) {
                const gamepadInput: GamepadInput = {
                  button: buttonIndex,
                };
                state.setValues({
                  heldGamepadInputs: [
                    ...state.values.heldGamepadInputs,
                    gamepadInput,
                  ],
                });
                if (state.values.hasInteracted) {
                  state.setValues({
                    pressedGamepadInputs: [
                      ...state.values.pressedGamepadInputs,
                      gamepadInput,
                    ],
                  });
                }
              } else if (
                state.values.heldGamepadInputs.some(
                  (heldGamepadInput: GamepadInput): boolean =>
                    heldGamepadInput.button === buttonIndex,
                ) &&
                !button.pressed
              ) {
                state.setValues({
                  heldGamepadInputs: state.values.heldGamepadInputs.filter(
                    (heldGamepadInput: GamepadInput): boolean =>
                      heldGamepadInput.button !== buttonIndex,
                  ),
                });
              }
            },
          );
        }
      });
    }
  }
  const onInputs: ((() => void) | null)[] = [];
  for (const pressedGamepadInput of state.values.pressedGamepadInputs) {
    getDefinables(InputPressHandler).forEach(
      (inputPressHandler: InputPressHandler): void => {
        onInputs.push(inputPressHandler.getGamepadOnInput(pressedGamepadInput));
      },
    );
  }
  for (const pressedMouseInput of state.values.pressedMouseInputs) {
    getDefinables(InputPressHandler).forEach(
      (inputPressHandler: InputPressHandler): void => {
        onInputs.push(inputPressHandler.getMouseOnInput(pressedMouseInput));
      },
    );
  }
  for (const keyboardPress of state.values.pressedKeyboardInputs) {
    getDefinables(InputPressHandler).forEach(
      (inputPressHandler: InputPressHandler): void => {
        onInputs.push(inputPressHandler.getKeyboardOnInput(keyboardPress));
      },
    );
  }
  for (const onInput of onInputs) {
    if (onInput !== null) {
      try {
        onInput();
      } catch (error: unknown) {
        handleCaughtError(error, "onInput");
      }
    }
  }
  getDefinables(InputTickHandler).forEach(
    (inputTickHandler: InputTickHandler<string>): void => {
      inputTickHandler.updateHeldButtons();
    },
  );
  state.setValues({
    didBlur: false,
    pressedGamepadInputs: [],
    pressedKeyboardInputs: [],
    pressedMouseInputs: [],
  });
};
