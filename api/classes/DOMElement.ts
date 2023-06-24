import getToken from "../functions/getToken";
import Definable from "./Definable";

class DOMElement extends Definable {
  private _id: string;

  public constructor(id: string) {
    super(getToken());
    this._id = id;
  }

  public getElement(): HTMLElement {
    const element: HTMLElement | null = document.getElementById(this._id);
    if (element !== null) {
      return element;
    }
    throw new Error(`DOMElement "${this._id}" does not have an element.`);
  }
}

export default DOMElement;
