import { Definable } from "./Definable";
import { KeyboardButton } from "../types/KeyboardButton";
import { getToken } from "../functions/getToken";
import { state } from "../state";

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
    if (state.values.isInitialized) {
      throw new Error(
        `Attempted to create InputCollection "${this._id}" after initialization.`,
      );
    }
    const controlsGridElement: HTMLElement | null =
      document.getElementById("controls-grid");
    if (controlsGridElement === null) {
      throw new Error(
        `An attempt was made to add InputCollection "${this._id}" to the pause menu with no controls grid element in the DOM.`,
      );
    }
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
    // Info
    const infoElement: HTMLDivElement = document.createElement("div");
    infoElement.classList.add("controls-info");
    // Name section
    const nameSectionElement: HTMLDivElement = document.createElement("div");
    infoElement.appendChild(nameSectionElement);
    const nameTextElement: HTMLSpanElement = document.createElement("span");
    nameTextElement.innerText = options.name;
    nameSectionElement.appendChild(nameTextElement);
    // Values section
    const valuesSectionElement: HTMLDivElement = document.createElement("div");
    infoElement.appendChild(valuesSectionElement);
    // Buttons section
    const buttonsSectionElement: HTMLDivElement = document.createElement("div");
    infoElement.appendChild(buttonsSectionElement);
    controlsGridElement.appendChild(infoElement);
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
