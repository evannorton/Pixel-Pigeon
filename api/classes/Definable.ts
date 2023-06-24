import definables from "../definables";
import getToken from "../functions/getToken";

abstract class Definable {
  private readonly _slug: string = getToken();

  public constructor() {
    if (definables.has(this.constructor.name) === false) {
      definables.set(this.constructor.name, new Map());
    }
    const list: Map<string, Definable> | undefined = definables.get(
      this.constructor.name
    );
    if (list) {
      list.set(this._slug, this);
    }
  }

  public get slug(): string {
    return this._slug;
  }

  protected getAccessorErrorMessage(property: string): string {
    return `Could not access ${this.constructor.name} "${this._slug}" ${property}.`;
  }
}

export default Definable;
