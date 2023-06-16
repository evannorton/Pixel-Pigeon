import Definable from "./Definable";

class DOMElement extends Definable {
  public constructor(slug: string) {
    super(slug);
  }

  public getElement(): HTMLElement {
    const element: HTMLElement | null = document.getElementById(this._slug);
    if (element !== null) {
      return element;
    }
    throw new Error(`DOMElement "${this._slug}" does not have an element.`);
  }
}

export default DOMElement;