import { Definable } from "./Definable";
import { InputKey } from "../types/InputKey";
import { getToken } from "../functions/getToken";

export interface InputTickHandlerGroup<GroupID> {
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
  /**
   * An array of strings that represents different inputs on a keyboard
   */
  keys?: InputKey[];
}
/**
 * Uses an array of InputTickHandlers to allow any number of inputs to be set up under one GroupID
 */
export interface CreateInputTickHandlerOptions<GroupID extends string> {
  groups: InputTickHandlerGroup<GroupID>[];
}
export class InputTickHandler<GroupID extends string> extends Definable {
  private readonly _options: CreateInputTickHandlerOptions<GroupID>;
  private readonly _groupIDs: GroupID[] = [];

  public constructor(options: CreateInputTickHandlerOptions<GroupID>) {
    super(getToken());
    this._options = options;
  }

  public getGroupID(): GroupID | null {
    return this._groupIDs[0] ?? null;
  }

  public handleKeyDown(button: string, numlock: boolean): void {
    for (const group of this._options.groups) {
      if (
        typeof group.keys !== "undefined" &&
        group.keys.some((key: InputKey): boolean => {
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
        this._groupIDs.unshift(group.id);
      }
    }
  }

  public handleKeyUp(button: string): void {
    for (const group of this._options.groups) {
      if (
        typeof group.keys !== "undefined" &&
        group.keys.some((key: InputKey): boolean => key.value === button)
      ) {
        this._groupIDs.splice(this._groupIDs.indexOf(group.id), 1);
      }
    }
  }

  public handleGamepadButtonDown(button: number): void {
    for (const group of this._options.groups) {
      if (
        typeof group.gamepadButtons !== "undefined" &&
        group.gamepadButtons.includes(button)
      ) {
        this._groupIDs.unshift(group.id);
      }
    }
  }

  public handleGamepadButtonUp(button: number): void {
    for (const group of this._options.groups) {
      if (
        typeof group.gamepadButtons !== "undefined" &&
        group.gamepadButtons.includes(button)
      ) {
        this._groupIDs.splice(this._groupIDs.indexOf(group.id), 1);
      }
    }
  }

  public empty(): void {
    this._groupIDs.length = 0;
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
