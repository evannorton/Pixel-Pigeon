import definables from "../definables";
import validSlugCharacters from "../constants/validSlugCharacters";

abstract class Definable {
  protected readonly _slug: string;

  public constructor(slug: string) {
    this._slug = slug;
    if (
      this._slug
        .split("")
        .some(
          (character: string): boolean =>
            character !== "/" &&
            validSlugCharacters.includes(character) === false
        )
    ) {
      throw new Error(
        `${this.constructor.name} "${this._slug}" has an invalid slug.`
      );
    }
    if (definables.has(this.constructor.name) === false) {
      definables.set(this.constructor.name, new Map());
    }
    const list: Map<string, Definable> | undefined = definables.get(
      this.constructor.name
    );
    if (list) {
      if (list.has(this._slug)) {
        throw new Error(
          `${this.constructor.name} "${this._slug}" already exists.`
        );
      }
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