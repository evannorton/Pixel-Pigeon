import { Definable } from "definables";
import { KeyboardButton } from "../types/KeyboardButton";
import { NumLock } from "../types/NumLock";
import {
  addInputBodyBoxElement,
  addInputBodyBoxTextElement,
  addInputBodyElement,
  addInputBodyNumlockWithElement,
  addInputBodyNumlockWithInputElement,
  addInputBodyNumlockWithoutElement,
  addInputBodyNumlockWithoutInputElement,
} from "../elements/addInputBodyElement";
import { emitInputCollectionsChange } from "../functions/emitInputCollectionsChange";
import { fireAlert } from "../functions/fireAlert";
import { state } from "../state";

export interface CreateInputCollectionOptionsKeyboardButton {
  numLock?: NumLock;
  value: string;
}
export interface CreateInputCollectionOptions {
  /**
   * An array of numbers that correlate to inputs on a controller
   */
  gamepadButtons?: readonly number[];
  /**
   * An array of directions that the joystick can move in
   */
  joystickDirections?: readonly ("down" | "left" | "right" | "up")[];
  /**
   * An array of strings that represents different inputs on a keyboard
   */
  keyboardButtons?: readonly CreateInputCollectionOptionsKeyboardButton[];
  /**
   * An array of numbers that represents different inputs on a mouse
   */
  mouseButtons?: readonly number[];
  name: string;
}
export class InputCollection extends Definable {
  private readonly _buttonsAddElement: HTMLButtonElement;
  private readonly _buttonsClearElement: HTMLButtonElement;
  private readonly _buttonsResetElement: HTMLButtonElement;
  private readonly _defaultGamepadButtons: readonly number[];
  private readonly _defaultJoystickDirections: readonly (
    | "down"
    | "left"
    | "right"
    | "up"
  )[];

  private readonly _defaultKeyboardButtons: readonly KeyboardButton[];
  private readonly _defaultMouseButtons: readonly number[];
  private _gamepadButtons: number[];
  private readonly _name: string;
  private _joystickDirections: ("down" | "left" | "right" | "up")[];

  private _keyboardButtons: KeyboardButton[];
  private _mouseButtons: number[];
  private readonly _valuesEmptyElement: HTMLSpanElement;
  private readonly _valuesGamepadElement: HTMLSpanElement;
  private readonly _valuesKeyboardElement: HTMLSpanElement;
  private readonly _valuesMouseElement: HTMLSpanElement;
  public constructor(options: CreateInputCollectionOptions) {
    super();
    if (state.values.isInitialized) {
      throw new Error(
        `An attempt was made to create InputCollection "${this._id}" after initialization.`,
      );
    }
    const controlsGridElement: HTMLElement | null =
      document.getElementById("controls-grid");
    if (controlsGridElement === null) {
      throw new Error(
        `An attempt was made to add InputCollection "${this._id}" to the pause menu with no controls grid element in the DOM.`,
      );
    }
    const gamepadButtons: readonly number[] = options.gamepadButtons ?? [];
    this._defaultGamepadButtons = gamepadButtons;
    this._gamepadButtons = [...gamepadButtons];
    const joystickDirections: readonly ("down" | "left" | "right" | "up")[] =
      options.joystickDirections ?? [];
    this._defaultJoystickDirections = joystickDirections;
    this._joystickDirections = [...joystickDirections];
    const keyboardButtons: KeyboardButton[] = (
      options.keyboardButtons ?? []
    ).map(
      (
        keyboardButton: CreateInputCollectionOptionsKeyboardButton,
      ): KeyboardButton => ({
        numLock: keyboardButton.numLock ?? NumLock.Default,
        value: keyboardButton.value,
      }),
    );
    this._defaultKeyboardButtons = keyboardButtons;
    this._keyboardButtons = [...keyboardButtons];
    this._name = options.name;
    const mouseButtons: readonly number[] = options.mouseButtons ?? [];
    this._defaultMouseButtons = mouseButtons;
    this._mouseButtons = [...mouseButtons];
    // Info
    const infoElement: HTMLDivElement = document.createElement("div");
    infoElement.classList.add("controls-info");
    // Name section
    const nameSectionElement: HTMLDivElement = document.createElement("div");
    infoElement.appendChild(nameSectionElement);
    const nameTextElement: HTMLSpanElement = document.createElement("span");
    nameTextElement.innerText = this._name;
    nameSectionElement.appendChild(nameTextElement);
    // Values section
    const valuesSectionElement: HTMLDivElement = document.createElement("div");
    infoElement.appendChild(valuesSectionElement);
    this._valuesEmptyElement = document.createElement("span");
    this._valuesEmptyElement.innerText = "No inputs set";
    this._valuesMouseElement = document.createElement("span");
    this._valuesGamepadElement = document.createElement("span");
    this._valuesKeyboardElement = document.createElement("span");
    valuesSectionElement.appendChild(this._valuesEmptyElement);
    valuesSectionElement.appendChild(this._valuesMouseElement);
    valuesSectionElement.appendChild(this._valuesGamepadElement);
    valuesSectionElement.appendChild(this._valuesKeyboardElement);
    // Buttons section
    const buttonsSectionElement: HTMLDivElement = document.createElement("div");
    this._buttonsAddElement = document.createElement("button");
    this._buttonsAddElement.innerText = "Add input";
    this._buttonsAddElement.addEventListener("click", (): void => {
      fireAlert({
        bodyElement: addInputBodyElement,
        onConfirm: (): void => {
          const numLock: NumLock | null =
            addInputBodyNumlockWithInputElement.checked &&
            addInputBodyNumlockWithoutInputElement.checked
              ? NumLock.Default
              : addInputBodyNumlockWithInputElement.checked
                ? NumLock.With
                : addInputBodyNumlockWithoutInputElement.checked
                  ? NumLock.Without
                  : null;
          if (state.values.addingKeyboardValue !== null && numLock !== null) {
            this.bindKeyboardButton({
              numLock,
              value: state.values.addingKeyboardValue,
            });
            state.setValues({
              addingKeyboardValue: null,
            });
          }
          if (state.values.addingMouseValue !== null) {
            this.bindMouseButton(state.values.addingMouseValue);
            state.setValues({
              addingMouseValue: null,
            });
          }
          if (state.values.addingGamepadValue !== null) {
            this.bindGamepadButton(state.values.addingGamepadValue);
            state.setValues({
              addingGamepadValue: null,
            });
          }
        },
        showCancelButton: true,
        showConfirmButton: true,
        title: "Add input",
      });
      addInputBodyBoxTextElement.innerText = "Press any input";
      addInputBodyNumlockWithElement.style.display = "none";
      addInputBodyNumlockWithoutElement.style.display = "none";
      addInputBodyBoxElement.focus();
      state.setValues({
        addInputCollectionID: this._id,
      });
    });
    this._buttonsClearElement = document.createElement("button");
    this._buttonsClearElement.innerText = "Clear inputs";
    this._buttonsClearElement.addEventListener("click", (): void => {
      this.clearInputs();
    });
    this._buttonsResetElement = document.createElement("button");
    this._buttonsResetElement.innerText = "Reset to defaults";
    this._buttonsResetElement.addEventListener("click", (): void => {
      this.resetToDefault();
    });
    buttonsSectionElement.appendChild(this._buttonsAddElement);
    buttonsSectionElement.appendChild(this._buttonsClearElement);
    buttonsSectionElement.appendChild(this._buttonsResetElement);
    infoElement.appendChild(buttonsSectionElement);
    controlsGridElement.appendChild(infoElement);
    this.updateValuesElements();
  }

  public get gamepadButtons(): readonly number[] {
    return this._gamepadButtons;
  }

  public get joystickDirections(): readonly (
    | "down"
    | "left"
    | "right"
    | "up"
  )[] {
    return this._joystickDirections;
  }

  public get keyboardButtons(): readonly KeyboardButton[] {
    return this._keyboardButtons;
  }

  public get name(): string {
    return this._name;
  }

  public get mouseButtons(): readonly number[] {
    return this._mouseButtons;
  }

  public matchesDefaultInputs(): boolean {
    const gamepadButtonsMatch: boolean = this.inputValuesMatch(
      this._gamepadButtons,
      this._defaultGamepadButtons,
    );
    const joystickDirectionsMatch: boolean = this.inputValuesMatch(
      this._joystickDirections,
      this._defaultJoystickDirections,
    );
    const keyboardButtonsMatch: boolean = this.keyboardButtonsMatchDefaults();
    const mouseButtonsMatch: boolean = this.inputValuesMatch(
      this._mouseButtons,
      this._defaultMouseButtons,
    );
    return (
      gamepadButtonsMatch &&
      joystickDirectionsMatch &&
      keyboardButtonsMatch &&
      mouseButtonsMatch
    );
  }

  public bindGamepadButton(gamepadButton: number): void {
    if (this._gamepadButtons.includes(gamepadButton) === false) {
      this._gamepadButtons.push(gamepadButton);
      this.updateValuesElements();
      emitInputCollectionsChange();
    }
  }

  public bindKeyboardButton(keyboardButton: KeyboardButton): void {
    const hasKeyboardButton: boolean = this._keyboardButtons.some(
      (existingKeyboardButton: KeyboardButton): boolean =>
        existingKeyboardButton.value === keyboardButton.value &&
        existingKeyboardButton.numLock === keyboardButton.numLock,
    );
    if (hasKeyboardButton === false) {
      this._keyboardButtons.push({
        numLock: keyboardButton.numLock,
        value: keyboardButton.value,
      });
      this.updateValuesElements();
      emitInputCollectionsChange();
    }
  }

  public bindMouseButton(mouseButton: number): void {
    if (this._mouseButtons.includes(mouseButton) === false) {
      this._mouseButtons.push(mouseButton);
      this.updateValuesElements();
      emitInputCollectionsChange();
    }
  }

  public clearInputs(): void {
    this._gamepadButtons.length = 0;
    this._joystickDirections.length = 0;
    this._keyboardButtons.length = 0;
    this._mouseButtons.length = 0;
    this.updateValuesElements();
    emitInputCollectionsChange();
  }

  public resetToDefault(): void {
    this._gamepadButtons = [...this._defaultGamepadButtons];
    this._joystickDirections = [...this._defaultJoystickDirections];
    this._keyboardButtons = [...this._defaultKeyboardButtons];
    this._mouseButtons = [...this._defaultMouseButtons];
    this.updateValuesElements();
    emitInputCollectionsChange();
  }

  private inputValuesMatch<Value>(
    values: readonly Value[],
    defaultValues: readonly Value[],
  ): boolean {
    let valuesMatch: boolean = values.length === defaultValues.length;
    if (valuesMatch) {
      for (
        let valueIndex: number = 0;
        valueIndex < values.length;
        valueIndex++
      ) {
        const value: Value | undefined = values[valueIndex];
        const defaultValue: Value | undefined = defaultValues[valueIndex];
        if (
          typeof value === "undefined" ||
          typeof defaultValue === "undefined"
        ) {
          throw new Error("Input value is missing.");
        }
        if (value !== defaultValue) {
          valuesMatch = false;
        }
      }
    }
    return valuesMatch;
  }

  private keyboardButtonsMatchDefaults(): boolean {
    let keyboardButtonsMatch: boolean =
      this._keyboardButtons.length === this._defaultKeyboardButtons.length;
    if (keyboardButtonsMatch) {
      for (
        let keyboardButtonIndex: number = 0;
        keyboardButtonIndex < this._keyboardButtons.length;
        keyboardButtonIndex++
      ) {
        const keyboardButton: KeyboardButton | undefined =
          this._keyboardButtons[keyboardButtonIndex];
        const defaultKeyboardButton: KeyboardButton | undefined =
          this._defaultKeyboardButtons[keyboardButtonIndex];
        if (
          typeof keyboardButton === "undefined" ||
          typeof defaultKeyboardButton === "undefined"
        ) {
          throw new Error("Keyboard button is missing.");
        }
        if (
          keyboardButton.numLock !== defaultKeyboardButton.numLock ||
          keyboardButton.value !== defaultKeyboardButton.value
        ) {
          keyboardButtonsMatch = false;
        }
      }
    }
    return keyboardButtonsMatch;
  }

  private updateValuesElements(): void {
    this._valuesMouseElement.innerText = `Mouse: ${this._mouseButtons.join(
      ", ",
    )}`;
    if (this._mouseButtons.length === 0) {
      this._valuesMouseElement.style.display = "none";
    } else {
      this._valuesMouseElement.style.display = "block";
    }
    this._valuesGamepadElement.innerText = `Gamepad: ${this._gamepadButtons.join(
      ", ",
    )}`;
    if (this._gamepadButtons.length === 0) {
      this._valuesGamepadElement.style.display = "none";
    } else {
      this._valuesGamepadElement.style.display = "block";
    }
    this._valuesKeyboardElement.innerText = `Keyboard: ${this._keyboardButtons
      .map(
        (keyboardButton: KeyboardButton): string =>
          `${keyboardButton.value}${
            keyboardButton.numLock === NumLock.With
              ? " (with NumLock)"
              : keyboardButton.numLock === NumLock.Without
                ? " (without NumLock)"
                : ""
          }`,
      )
      .join(", ")}`;
    if (this._keyboardButtons.length === 0) {
      this._valuesKeyboardElement.style.display = "none";
    } else {
      this._valuesKeyboardElement.style.display = "block";
    }
    const isEmpty: boolean =
      this._mouseButtons.length > 0 ||
      this._gamepadButtons.length > 0 ||
      this._keyboardButtons.length > 0;
    this._buttonsClearElement.style.display = isEmpty ? "block" : "none";
    this._valuesEmptyElement.style.display = !isEmpty ? "block" : "none";
  }
}
/**
 * @returns String that can be used to identify the Handler
 */
export const createInputCollection = (
  options: CreateInputCollectionOptions,
): string => new InputCollection(options).id;
