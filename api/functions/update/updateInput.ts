import { GamepadInput } from "../../types/GamepadInput";
import { InputPressHandler } from "../../classes/InputPressHandler";
import { InputTickHandler } from "../../classes/InputTickHandler";
import { getDefinables } from "../getDefinables";
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
  navigator.getGamepads().forEach((gamepad: Gamepad | null): void => {
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
  for (const pressedGamepadInput of state.values.pressedGamepadInputs) {
    getDefinables(InputPressHandler).forEach(
      (inputPressHandler: InputPressHandler): void => {
        inputPressHandler.handleGamepadInput(pressedGamepadInput);
      },
    );
  }
  for (const pressedMouseInput of state.values.pressedMouseInputs) {
    getDefinables(InputPressHandler).forEach(
      (inputPressHandler: InputPressHandler): void => {
        inputPressHandler.handleMouseInput(pressedMouseInput);
      },
    );
  }
  for (const keyboardPress of state.values.pressedKeyboardInputs) {
    getDefinables(InputPressHandler).forEach(
      (inputPressHandler: InputPressHandler): void => {
        inputPressHandler.handleKeyboardInput(keyboardPress);
      },
    );
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
