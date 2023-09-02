import { Definable } from "pigeon-mode-game-framework/api/classes/Definable";
import { getToken } from "pigeon-mode-game-framework/api/functions/getToken";


interface InputTickHandlerGroup<GroupID> {
  /**
   * An array of numbers that corresponds to different inputs on a controller
   */
  readonly gamepadButtons?: number[];
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
  readonly id: GroupID;
  /**
   * An array of strings that represents different inputs on a keyboard
   */
  readonly keys?: string[];
}
/**
 * Uses an array of InputTickHandlers to allow any number of inputs to be set up under one GroupID
 */
interface InputTickHandlerOptions<GroupID extends string> {
  readonly groups: InputTickHandlerGroup<GroupID>[];
}

export class InputTickHandler<GroupID extends string> extends Definable {
  private readonly _options: InputTickHandlerOptions<GroupID>;
  private readonly _groupIDs: GroupID[] = [];

  public constructor(options: InputTickHandlerOptions<GroupID>) {
    super(getToken());
    this._options = options;
  }

  public getGroupID(): GroupID | null {
    return this._groupIDs[0] ?? null;
  }

  public handleKeyDown(button: string): void {
    for (const group of this._options.groups) {
      if (typeof group.keys !== "undefined" && group.keys.includes(button)) {
        this._groupIDs.unshift(group.id);
      }
    }
  }

  public handleKeyUp(button: string): void {
    for (const group of this._options.groups) {
      if (typeof group.keys !== "undefined" && group.keys.includes(button)) {
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
  options: InputTickHandlerOptions<GroupID>,
): string => new InputTickHandler(options).id;
