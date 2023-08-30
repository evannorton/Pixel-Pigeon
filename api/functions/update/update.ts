import { InputPressHandler } from "pigeon-mode-game-framework/api/classes/InputPressHandler";
import { InputTickHandler } from "pigeon-mode-game-framework/api/classes/InputTickHandler";
import { getDefinables } from "pigeon-mode-game-framework/api/functions/getDefinables";
import { state } from "pigeon-mode-game-framework/api/state";
import { updateLevel } from "pigeon-mode-game-framework/api/functions/update/updateLevel";

export const update = (): void => {
  if (state.values.world === null) {
    throw new Error("An attempt was made to update before world was loaded.");
  }
  if (state.values.hasInteracted) {
    state.setValues({ hasDoneInputPressForTick: false });
    navigator.getGamepads().forEach((gamepad: Gamepad | null): void => {
      if (gamepad) {
        gamepad.buttons.forEach(
          (button: GamepadButton, buttonIndex: number): void => {
            if (
              !state.values.heldGamepadButtons.includes(buttonIndex) &&
              Boolean(button.pressed)
            ) {
              state.setValues({
                heldGamepadButtons: [
                  ...state.values.heldGamepadButtons,
                  buttonIndex,
                ],
              });
              getDefinables(InputPressHandler).forEach(
                (inputPressHandler: InputPressHandler): void => {
                  inputPressHandler.handleGamepadButton(buttonIndex);
                },
              );
              getDefinables(InputTickHandler).forEach(
                (inputPressHandler: InputTickHandler<string>): void => {
                  inputPressHandler.handleGamepadButtonDown(buttonIndex);
                },
              );
            } else if (
              state.values.heldGamepadButtons.includes(buttonIndex) &&
              !button.pressed
            ) {
              state.setValues({
                heldGamepadButtons: state.values.heldGamepadButtons.filter(
                  (gamepadButtonIndex: number): boolean =>
                    buttonIndex !== gamepadButtonIndex,
                ),
              });
              getDefinables(InputTickHandler).forEach(
                (inputPressHandler: InputTickHandler<string>): void => {
                  inputPressHandler.handleGamepadButtonUp(buttonIndex);
                },
              );
            }
          },
        );
      }
    });
    if (state.values.levelID !== null) {
      updateLevel();
    }
    for (const onTickCallback of state.values.onTickCallbacks) {
      onTickCallback();
    }
  }
};
