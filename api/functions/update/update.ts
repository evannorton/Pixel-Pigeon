import { InputPressHandler } from "../../classes/InputPressHandler";
import { InputTickHandler } from "../../classes/InputTickHandler";
import { SpriteInstance } from "../../classes/SpriteInstance";
import { getDefinables } from "../getDefinables";
import { state } from "../../state";
import { updateLevel } from "./updateLevel";

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
    getDefinables(SpriteInstance).forEach(
      (spriteInstance: SpriteInstance): void => {
        spriteInstance.playAnimation();
        spriteInstance.drawAtCoordinates();
      },
    );
    if (
      state.values.pauseMenuCondition !== null &&
      state.values.pauseMenuCondition()
    ) {
      document.body.classList.add("pausable");
    } else {
      document.body.classList.remove("pausable");
    }
  }
};
