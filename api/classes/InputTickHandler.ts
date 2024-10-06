import { Definable, getDefinable } from "definables";
import { InputCollection } from "./InputCollection";
import { KeyboardButton } from "../types/KeyboardButton";
import { NumLock } from "../types/NumLock";
import { state } from "../state";

export interface CreateInputTickHandlerOptionsGroup<GroupID> {
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
  inputCollectionID: string;
}
/**
 * Uses an array of InputTickHandlers to allow any number of inputs to be set up under one GroupID
 */
export interface CreateInputTickHandlerOptions<GroupID extends string> {
  groups: CreateInputTickHandlerOptionsGroup<GroupID>[];
}
interface InputTickHandlerGroup<GroupID extends string> {
  readonly id: GroupID;
  readonly inputCollectionID: string;
}

export class InputTickHandler<GroupID extends string> extends Definable {
  private _groupIDs: GroupID[] = [];
  private readonly _groups: InputTickHandlerGroup<GroupID>[];

  public constructor(options: CreateInputTickHandlerOptions<GroupID>) {
    super();
    this._groups = options.groups.map(
      (
        group: CreateInputTickHandlerOptionsGroup<GroupID>,
      ): InputTickHandlerGroup<GroupID> => ({
        id: group.id,
        inputCollectionID: group.inputCollectionID,
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
    const inputCollection: InputCollection = getDefinable(
      InputCollection,
      group.inputCollectionID,
    );
    for (const heldKeyboardInput of state.values.heldKeyboardInputs) {
      if (
        inputCollection.keyboardButtons.some(
          (keyboardButton: KeyboardButton): boolean => {
            if (keyboardButton.value === heldKeyboardInput.button) {
              switch (keyboardButton.numLock) {
                case NumLock.Default:
                  return true;
                case NumLock.With:
                  return heldKeyboardInput.numLock;
                case NumLock.Without:
                  return heldKeyboardInput.numLock === false;
              }
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
        inputCollection.mouseButtons.some((mouseButton: number): boolean => {
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
        inputCollection.gamepadButtons.some(
          (gamepadButton: number): boolean => {
            if (gamepadButton === heldGameInput.button) {
              return true;
            }
            return false;
          },
        )
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
