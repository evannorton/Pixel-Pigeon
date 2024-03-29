import { definables } from "../definables";
import { validIDCharacters } from "../constants/validIDCharacters";

export abstract class Definable {
  protected readonly _id: string;

  public constructor(id: string) {
    this._id = id;
    if (
      this._id
        .split("")
        .some(
          (character: string): boolean =>
            validIDCharacters.includes(character) === false,
        )
    ) {
      throw new Error(
        `${this.constructor.name} "${this._id}" has an invalid id.`,
      );
    }
    if (definables.has(this.constructor.name) === false) {
      definables.set(this.constructor.name, new Map());
    }
    const list: Map<string, Definable> | undefined = definables.get(
      this.constructor.name,
    );
    if (list) {
      if (list.has(this._id)) {
        throw new Error(
          `${this.constructor.name} "${this._id}" already exists.`,
        );
      }
      list.set(this._id, this);
    }
  }

  public get id(): string {
    return this._id;
  }

  public remove(): void {
    const definablesMap: Map<string, Definable> | undefined = definables.get(
      this.constructor.name,
    );
    if (typeof definablesMap === "undefined") {
      throw new Error(
        `An attempt was made to remove ${this.constructor.name} "${this._id}" with no existing definables map.`,
      );
    }
    definablesMap.delete(this._id);
  }

  protected getAccessorErrorMessage(property: string): string {
    return `Could not access ${this.constructor.name} "${this._id}" ${property}.`;
  }
}
