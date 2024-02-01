import { Definable } from "./Definable";
import { KeyboardButton } from "../types/KeyboardButton";
import { getToken } from "../functions/getToken";
import { state } from "../state";

export interface CreateInputTickHandlerOptionsGroupKeyboardButton {
  numlock?: boolean;
  value: string;
  withoutNumlock?: boolean;
}
export interface CreateInputTickHandlerOptionsGroup<GroupID> {
  /**
   * An array of numbers that corresponds to different inputs on a controller
   */
  gamepadButtons?: number[];
  /**
   * ID to differentiate inputs from the same overarching GroupID
   * @example
   * ```ts
   * // Group 1
   * id: XDirection.Left,
   * // Group 2
   * id: XDirection.Right,
   *
   * // Both are under the XDirection umbrella, however they are in different directions so they have different logic for animations and movement.
   * ```
   */
  id: GroupID;
  keyboardButtons?: CreateInputTickHandlerOptionsGroupKeyboardButton[];
  mouseButtons?: number[];
}
/**
 * Uses an array of InputTickHandlers to allow any number of inputs to be set up under one GroupID
 */
export interface CreateInputTickHandlerOptions<GroupID extends string> {
  groups: CreateInputTickHandlerOptionsGroup<GroupID>[];
}
interface InputTickHandlerGroup<GroupID extends string> {
  readonly gamepadButtons: number[];
  readonly id: GroupID;
  readonly keyboardButtons: KeyboardButton[];
  readonly mouseButtons: number[];
}

export class InputTickHandler<GroupID extends string> extends Definable {
  private _groupIDs: GroupID[] = [];
  private readonly _groups: InputTickHandlerGroup<GroupID>[];

  public constructor(options: CreateInputTickHandlerOptions<GroupID>) {
    super(getToken());
    this._groups = options.groups.map(
      (
        group: CreateInputTickHandlerOptionsGroup<GroupID>,
      ): InputTickHandlerGroup<GroupID> => ({
        gamepadButtons: group.gamepadButtons ?? [],
        id: group.id,
        keyboardButtons: (group.keyboardButtons ?? []).map(
          (
            keyboardButton: CreateInputTickHandlerOptionsGroupKeyboardButton,
          ): KeyboardButton => ({
            numlock: keyboardButton.numlock ?? false,
            value: keyboardButton.value,
            withoutNumlock: keyboardButton.withoutNumlock ?? false,
          }),
        ),
        mouseButtons: group.mouseButtons ?? [],
      }),
    );
  }

  public getGroupID(): GroupID | null {
    return this._groupIDs[0] ?? null;
  }

  public empty(): void {
    this._groupIDs.length = 0;
  }

  public updateHeldButtons(): void {
    for (const group of this._groups) {
      if (this.groupHasHeldButton(group)) {
        if (this._groupIDs.includes(group.id) === false) {
          this._groupIDs.unshift(group.id);
        }
      } else {
        this._groupIDs = this._groupIDs.filter(
          (groupID: GroupID): boolean => groupID !== group.id,
        );
      }
    }
  }

  private groupHasHeldButton(group: InputTickHandlerGroup<GroupID>): boolean {
    for (const heldKeyboardInput of state.values.heldKeyboardInputs) {
      if (
        group.keyboardButtons.some(
          (keyboardButton: KeyboardButton): boolean => {
            if (keyboardButton.value === heldKeyboardInput.button) {
              if (keyboardButton.numlock === true) {
                return heldKeyboardInput.numlock;
              }
              if (keyboardButton.withoutNumlock === true) {
                return heldKeyboardInput.numlock === false;
              }
              return true;
            }
            return false;
          },
        )
      ) {
        return true;
      }
    }
    for (const heldMouseInput of state.values.heldMouseInputs) {
      if (
        group.mouseButtons.some((mouseButton: number): boolean => {
          if (mouseButton === heldMouseInput.button) {
            return true;
          }
          return false;
        })
      ) {
        return true;
      }
    }
    for (const heldGameInput of state.values.heldGamepadInputs) {
      if (
        group.gamepadButtons.some((gamepadButton: number): boolean => {
          if (gamepadButton === heldGameInput.button) {
            return true;
          }
          return false;
        })
      ) {
        return true;
      }
    }
    return false;
  }
}
/**
 *
 * @param options - Defines what groups of inputs should be defined with the GroupID
 * @returns A string GroupID to seperate different TickHandlers
 */
export const createInputTickHandler = <GroupID extends string>(
  options: CreateInputTickHandlerOptions<GroupID>,
): string => new InputTickHandler(options).id;
