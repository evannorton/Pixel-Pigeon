import InputHandler from "../classes/InputHandler";
import getDefinables from "./getDefinables";
import state from "../state";

const update = (): void => {
  if (state.values.hasInteracted) {
    state.values.gamepads.forEach((gamepad: Gamepad): void => {
      gamepad.buttons.forEach(
        (button: GamepadButton, buttonIndex: number): void => {
          if (
            !state.values.heldGamepadButtons.includes(buttonIndex) &&
            !!button.pressed
          ) {
            state.setValues({
              heldGamepadButtons: [
                ...state.values.heldGamepadButtons,
                buttonIndex,
              ],
            });
            getDefinables(InputHandler).forEach((inputHandler): void => {
              inputHandler.handleGamepadButton(buttonIndex);
            });
          } else if (
            state.values.heldGamepadButtons.includes(buttonIndex) &&
            !button.pressed
          ) {
            state.setValues({
              heldGamepadButtons: state.values.heldGamepadButtons.filter(
                (gamepadButtonIndex: number): boolean =>
                  buttonIndex !== gamepadButtonIndex
              ),
            });
          }
        }
      );
    });
  }
};

export default update;
