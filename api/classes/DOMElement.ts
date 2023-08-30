import { Definable } from "pigeon-mode-game-framework/api/classes/Definable";

interface DOMElementOptions {
  readonly id: string;
}

export class DOMElement extends Definable {
  private readonly _options: DOMElementOptions;

  public constructor(options: DOMElementOptions) {
    super(options.id);
    this._options = options;
  }

  public getElement(): HTMLElement {
    const element: HTMLElement | null = document.getElementById(
      this._options.id,
    );
    if (element !== null) {
      return element;
    }
    throw new Error(
      `DOMElement "${this._options.id}" does not have an element.`,
    );
  }
}
