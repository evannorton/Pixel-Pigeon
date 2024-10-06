import { Definable, getDefinable } from "definables";
import { GamepadInput } from "../types/GamepadInput";
import { InputCollection } from "./InputCollection";
import { KeyboardButton } from "../types/KeyboardButton";
import { KeyboardInput } from "../types/KeyboardInput";
import { MouseInput } from "../types/MouseInput";
import { NumLock } from "../types/NumLock";
import { handleCaughtError } from "../functions/handleCaughtError";

/** Defines options for InputPressHandlers, which mainly is about what inputs to press and the callbacks */
export interface CreateInputPressHandlerOptions {
  /**
   * Callback to determine if the input should run or not
   * @returns Boolean in which false will skip the input from being processed
   */
  condition?: () => boolean;
  inputCollectionID: string;
  onInput: () => void;
}
export class InputPressHandler extends Definable {
  private readonly _condition?: () => boolean;
  private readonly _inputCollectionID: string;
  private readonly _onInput: () => void;

  public constructor(options: CreateInputPressHandlerOptions) {
    super();
    this._condition = options.condition;
    this._inputCollectionID = options.inputCollectionID;
    this._onInput = options.onInput;
  }

  private get inputCollection(): InputCollection {
    return getDefinable(InputCollection, this._inputCollectionID);
  }

  public getGamepadOnInput(gamepadInput: GamepadInput): (() => void) | null {
    if (this.inputCollection.gamepadButtons.includes(gamepadInput.button)) {
      return this.getOnInput();
    }
    return null;
  }

  public getKeyboardOnInput(keyboardInput: KeyboardInput): (() => void) | null {
    if (
      this.inputCollection.keyboardButtons.some(
        (key: KeyboardButton): boolean => {
          if (key.value === keyboardInput.button) {
            switch (key.numLock) {
              case NumLock.Default:
                return true;
              case NumLock.With:
                return keyboardInput.numLock;
              case NumLock.Without:
                return keyboardInput.numLock === false;
            }
          }
          return false;
        },
      )
    ) {
      return this.getOnInput();
    }
    return null;
  }

  public getMouseOnInput(mouseInput: MouseInput): (() => void) | null {
    if (this.inputCollection.mouseButtons.includes(mouseInput.button)) {
      return this.getOnInput();
    }
    return null;
  }

  private getOnInput(): (() => void) | null {
    if (this.passesCondition()) {
      return this._onInput;
    }
    return null;
  }

  private passesCondition(): boolean {
    if (typeof this._condition === "undefined") {
      return true;
    }
    try {
      return this._condition();
    } catch (error: unknown) {
      handleCaughtError(
        error,
        `InputPressHandler "${this._id}" condition`,
        true,
      );
    }
    return false;
  }
}
/**
 *
 * @param options - Options that tell the InputPressHandler when to trigger and what function to trigger
 * @returns String that can be used to identify the Handler
 */
export const createInputPressHandler = (
  options: CreateInputPressHandlerOptions,
): string => new InputPressHandler(options).id;
