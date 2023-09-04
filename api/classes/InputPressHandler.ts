import { Definable } from "pigeon-mode-game-framework/api/classes/Definable";
import { getToken } from "pigeon-mode-game-framework/api/functions/getToken";
import { state } from "pigeon-mode-game-framework/api/state";

/** Defines options for InputPressHandlers, which mainly is about what inputs to press and the callbacks */
export interface InputPressHandlerOptions {
  /**
   * Callback to determine if the input should run or not
   * @returns Boolean in which false will skip the input from being processed
   */
  readonly condition?: () => boolean;
  /**
   * An array of numbers that correlate to inputs on a controller
   */
  readonly gamepadButtons?: number[];
  /**
   * An array of strings that correlate to inputs on a keyboard
   * @example
   * ```ts
   * keys: ["ArrowLeft", "KeyA"],
   * ```
   */
  readonly keys?: string[];
  /**
   * Should the input activate on left click?
   */
  readonly leftClick?: boolean;
  /**
   * Callback that triggers when supplied inputs are pressed and condition is true, if it exists
   */
  readonly onInput: () => void;
  /**
   * Should the input activate on right click?
   */
  readonly rightClick?: boolean;
}
export class InputPressHandler extends Definable {
  private readonly _options: InputPressHandlerOptions;

  public constructor(options: InputPressHandlerOptions) {
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

  public handleKey(button: string): void {
    if (
      typeof this._options.keys !== "undefined" &&
      this._options.keys.includes(button)
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
  options: InputPressHandlerOptions,
): string => new InputPressHandler(options).id;
