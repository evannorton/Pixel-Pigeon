import Definable from "./Definable";
import getToken from "../functions/getToken";
import state from "../state";

interface InputTickHandlerGroup<GroupID> {
  readonly gamepadButtons?: number[];
  readonly id: GroupID;
  readonly keys?: string[];
}
interface InputTickHandlerOptions<GroupID extends string> {
  readonly groups: InputTickHandlerGroup<GroupID>[];
}
class InputTickHandler<GroupID extends string> extends Definable {
  private readonly _options: InputTickHandlerOptions<GroupID>;
  private readonly _groupIDs: GroupID[] = [];

  public constructor(options: InputTickHandlerOptions<GroupID>) {
    if (state.values.isInitialized) {
      throw new Error(
        "A Definable was attempted to be constructed after initialization."
      );
    }
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
const createInputTickHandler = <GroupID extends string>(
  options: InputTickHandlerOptions<GroupID>
): string => new InputTickHandler(options).id;

export default InputTickHandler;
export { createInputTickHandler };
