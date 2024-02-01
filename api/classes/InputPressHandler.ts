import { Definable } from "./Definable";
import { GamepadInput } from "../types/GamepadInput";
import { KeyboardButton } from "../types/KeyboardButton";
import { KeyboardInput } from "../types/KeyboardInput";
import { MouseInput } from "../types/MouseInput";
import { getToken } from "../functions/getToken";
import { handleCaughtError } from "../functions/handleCaughtError";

export interface CreateInputPressHandlerOptionsGroupKeyboardButton {
  numlock?: boolean;
  value: string;
  withoutNumlock?: boolean;
}
/** Defines options for InputPressHandlers, which mainly is about what inputs to press and the callbacks */
export interface CreateInputPressHandlerOptions {
  /**
   * Callback to determine if the input should run or not
   * @returns Boolean in which false will skip the input from being processed
   */
  condition?: () => boolean;
  /**
   * An array of numbers that correlate to inputs on a controller
   */
  gamepadButtons?: number[];
  /**
   * An array of strings that represents different inputs on a keyboard
   */
  keyboardButtons?: CreateInputPressHandlerOptionsGroupKeyboardButton[];
  mouseButtons?: number[];
  /**
   * Callback that triggers when supplied inputs are pressed and condition is true, if it exists
   */
  onInput: () => void;
}
export class InputPressHandler extends Definable {
  private readonly _condition: (() => boolean) | null;
  private readonly _gamepadButtons: number[];
  private readonly _keyboardButtons: KeyboardButton[];
  private readonly _mouseButtons: number[];
  private readonly _onInput: () => void;

  public constructor(options: CreateInputPressHandlerOptions) {
    super(getToken());
    this._condition = options.condition ?? null;
    this._gamepadButtons = options.gamepadButtons ?? [];
    this._keyboardButtons = (options.keyboardButtons ?? []).map(
      (
        keyboardButton: CreateInputPressHandlerOptionsGroupKeyboardButton,
      ): KeyboardButton => ({
        numlock: keyboardButton.numlock ?? false,
        value: keyboardButton.value,
        withoutNumlock: keyboardButton.withoutNumlock ?? false,
      }),
    );
    this._mouseButtons = options.mouseButtons ?? [];
    this._onInput = options.onInput;
  }

  public getGamepadOnInput(gamepadInput: GamepadInput): (() => void) | null {
    if (this._gamepadButtons.includes(gamepadInput.button)) {
      return this.getOnInput();
    }
    return null;
  }

  public getKeyboardOnInput(keyboardInput: KeyboardInput): (() => void) | null {
    if (
      this._keyboardButtons.some((key: KeyboardButton): boolean => {
        if (key.value === keyboardInput.button) {
          if (key.numlock === true) {
            return keyboardInput.numlock;
          }
          if (key.withoutNumlock === true) {
            return keyboardInput.numlock === false;
          }
          return true;
        }
        return false;
      })
    ) {
      return this.getOnInput();
    }
    return null;
  }

  public getMouseOnInput(mouseInput: MouseInput): (() => void) | null {
    if (this._mouseButtons.includes(mouseInput.button)) {
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
    if (this._condition === null) {
      return true;
    }
    try {
      return this._condition();
    } catch (error: unknown) {
      handleCaughtError(error, `InputPressHandler "${this._id}" condition`);
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
