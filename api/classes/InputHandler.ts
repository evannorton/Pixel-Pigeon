import DOMElement from "./DOMElement";
import Definable from "./Definable";
import getDefinable from "../functions/getDefinable";
import getToken from "../functions/getToken";

interface Options {
  leftClick?: boolean;
  rightClick?: boolean;
  onInput(): void;
}

class InputHandler extends Definable {
  private _options: Options;

  public constructor(options: Options) {
    super(getToken());
    this._options = options;
  }

  public listen(): void {
    const screen = getDefinable(DOMElement, "screen").getElement();
    if (this._options.leftClick) {
      screen.addEventListener("mousedown", (event: MouseEvent): void => {
        if (event.button === 0) {
          this._options.onInput();
        }
      });
    }
    if (this._options.rightClick) {
      screen.addEventListener("mousedown", (event: MouseEvent): void => {
        if (event.button === 2) {
          this._options.onInput();
        }
      });
    }
  }
}

export default InputHandler;
