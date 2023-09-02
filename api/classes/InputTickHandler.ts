import { Definable } from "pigeon-mode-game-framework/api/classes/Definable";
import { getToken } from "pigeon-mode-game-framework/api/functions/getToken";


interface InputTickHandlerGroup<GroupID> {
  /**
   * An array of numbers that corresponds to different inputs on a controller
   */
  readonly gamepadButtons?: number[];
  /**
   * A string GroupID to differentiate InputTickHandlers
   */
  readonly id: GroupID;
  /**
   * An array of strings that represents different inputs on a keyboard
   */
  readonly keys?: string[];
}
/**
 * Uses an array of InputTickHandlers to allow multiple input's to be set up with one call
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
 * @param options - An array of {@link InputTickHandlerGroup}
 * @returns A string GroupID to seperate different TickHandlers
 */
export const createInputTickHandler = <GroupID extends string>(
  options: InputTickHandlerOptions<GroupID>,
): string => new InputTickHandler(options).id;
