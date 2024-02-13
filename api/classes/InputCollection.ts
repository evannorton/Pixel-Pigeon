import { Definable } from "./Definable";
import { KeyboardButton } from "../types/KeyboardButton";
import { getToken } from "../functions/getToken";

export interface CreateInputCollectionOptionsKeyboardButton {
  numlock?: boolean;
  value: string;
  withoutNumlock?: boolean;
}
export interface CreateInputCollectionOptions {
  /**
   * An array of numbers that correlate to inputs on a controller
   */
  gamepadButtons?: number[];
  /**
   * An array of strings that represents different inputs on a keyboard
   */
  keyboardButtons?: CreateInputCollectionOptionsKeyboardButton[];
  /**
   * An array of numbers that represents different inputs on a mouse
   */
  mouseButtons?: number[];
  name: string;
}
export class InputCollection extends Definable {
  private readonly _gamepadButtons: number[];
  private readonly _keyboardButtons: KeyboardButton[];
  private readonly _mouseButtons: number[];
  public constructor(options: CreateInputCollectionOptions) {
    super(getToken());
    this._gamepadButtons = options.gamepadButtons ?? [];
    this._keyboardButtons = (options.keyboardButtons ?? []).map(
      (
        keyboardButton: CreateInputCollectionOptionsKeyboardButton,
      ): KeyboardButton => ({
        numlock: keyboardButton.numlock ?? false,
        value: keyboardButton.value,
        withoutNumlock: keyboardButton.withoutNumlock ?? false,
      }),
    );
    this._mouseButtons = options.mouseButtons ?? [];
  }

  public get gamepadButtons(): number[] {
    return this._gamepadButtons;
  }

  public get keyboardButtons(): KeyboardButton[] {
    return this._keyboardButtons;
  }

  public get mouseButtons(): number[] {
    return this._mouseButtons;
  }
}
/**
 * @returns String that can be used to identify the Handler
 */
export const createInputCollection = (
  options: CreateInputCollectionOptions,
): string => new InputCollection(options).id;
