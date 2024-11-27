import { GamepadInput } from "../../types/GamepadInput";
import { InputPressHandler } from "../../classes/InputPressHandler";
import { InputTickHandler } from "../../classes/InputTickHandler";
import { assetsAreLoaded } from "../assetsAreLoaded";
import { getDefinables } from "definables";
import { getGamepads } from "../getGamepads";
import { handleCaughtError } from "../handleCaughtError";
import { state } from "../../state";

export const updateInput = (): void => {
  getGamepads().forEach((gamepad: Gamepad): void => {
    gamepad.buttons.forEach(
      (gamepadButton: GamepadButton, gamepadButtonIndex: number): void => {
        if (
          !state.values.heldGamepadInputs.some(
            (heldGamepadInput: GamepadInput): boolean =>
              heldGamepadInput.button === gamepadButtonIndex,
          ) &&
          gamepadButton.pressed &&
          gamepadButton.value === 1
        ) {
          const gamepadInput: GamepadInput = {
            button: gamepadButtonIndex,
          };
          state.setValues({
            heldGamepadInputs: [
              ...state.values.heldGamepadInputs,
              gamepadInput,
            ],
          });
          if (state.values.hasInteracted && assetsAreLoaded()) {
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
              heldGamepadInput.button === gamepadButtonIndex,
          ) &&
          (!gamepadButton.pressed || gamepadButton.value < 1)
        ) {
          state.setValues({
            heldGamepadInputs: state.values.heldGamepadInputs.filter(
              (heldGamepadInput: GamepadInput): boolean =>
                heldGamepadInput.button !== gamepadButtonIndex,
            ),
          });
          const gamepadInput: GamepadInput = {
            button: gamepadButtonIndex,
          };
          if (state.values.hasInteracted && assetsAreLoaded()) {
            state.setValues({
              releasedGamepadInputs: [
                ...state.values.releasedGamepadInputs,
                gamepadInput,
              ],
            });
          }
        }
      },
    );
  });
  const onInputs: ((() => void) | null)[] = [];
  for (const pressedGamepadInput of state.values.pressedGamepadInputs) {
    getDefinables(InputPressHandler).forEach(
      (inputPressHandler: InputPressHandler): void => {
        onInputs.push(inputPressHandler.getGamepadOnInput(pressedGamepadInput));
      },
    );
  }
  for (const releasedGamepadInput of state.values.releasedGamepadInputs) {
    getDefinables(InputPressHandler).forEach(
      (inputPressHandler: InputPressHandler): void => {
        onInputs.push(
          inputPressHandler.getGamepadOnRelease(releasedGamepadInput),
        );
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
  for (const mouseRelease of state.values.releasedMouseInputs) {
    getDefinables(InputPressHandler).forEach(
      (inputPressHandler: InputPressHandler): void => {
        onInputs.push(inputPressHandler.getMouseOnRelease(mouseRelease));
      },
    );
  }
  for (const keyboardRelease of state.values.releasedKeyboardInputs) {
    getDefinables(InputPressHandler).forEach(
      (inputPressHandler: InputPressHandler): void => {
        onInputs.push(inputPressHandler.getKeyboardOnRelease(keyboardRelease));
      },
    );
  }
  for (const onInput of onInputs) {
    if (onInput !== null) {
      try {
        onInput();
      } catch (error: unknown) {
        handleCaughtError(error, "onInput", true);
      }
    }
  }
  getDefinables(InputTickHandler).forEach(
    (inputTickHandler: InputTickHandler<string>): void => {
      inputTickHandler.updateHeldButtons();
    },
  );
  state.setValues({
    pressedGamepadInputs: [],
    pressedKeyboardInputs: [],
    pressedMouseInputs: [],
    releasedGamepadInputs: [],
    releasedKeyboardInputs: [],
    releasedMouseInputs: [],
  });
};
