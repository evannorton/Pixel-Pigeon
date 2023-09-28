import { Definable } from "./Definable";
import { InputKey } from "../types/InputKey";
import { getToken } from "../functions/getToken";
import { state } from "../state";

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
  keys?: InputKey[];
  /**
   * Should the input activate on left click?
   */
  leftClick?: boolean;
  /**
   * Callback that triggers when supplied inputs are pressed and condition is true, if it exists
   */
  onInput: () => void;
  /**
   * Should the input activate on right click?
   */
  rightClick?: boolean;
}
export class InputPressHandler extends Definable {
  private readonly _options: CreateInputPressHandlerOptions;

  public constructor(options: CreateInputPressHandlerOptions) {
    super(getToken());
    this._options = options;
  }

  public handleClick(button: number): void {
    if (
      (Boolean(this._options.leftClick) && button === 0) ||
      (Boolean(this._options.rightClick) && button === 2)
    ) {
      this.attemptInput();
    }
  }

  public handleKey(button: string, numlock: boolean): void {
    if (
      typeof this._options.keys !== "undefined" &&
      this._options.keys.some((key: InputKey): boolean => {
        if (key.value === button) {
          if (key.numlock === true) {
            return numlock;
          }
          if (key.withoutNumlock === true) {
            return !numlock;
          }
          return true;
        }
        return false;
      })
    ) {
      this.attemptInput();
    }
  }

  public handleGamepadButton(button: number): void {
    if (
      typeof this._options.gamepadButtons !== "undefined" &&
      this._options.gamepadButtons.includes(button)
    ) {
      this.attemptInput();
    }
  }

  private attemptInput(): void {
    if (
      !state.values.hasDoneInputPressForTick &&
      (typeof this._options.condition === "undefined" ||
        this._options.condition())
    ) {
      state.setValues({ hasDoneInputPressForTick: true });
      this._options.onInput();
    }
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
