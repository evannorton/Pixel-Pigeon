import DOMElement from "./DOMElement";
import Definable from "./Definable";
import getDefinable from "../functions/getDefinable";
import getToken from "../functions/getToken";

interface Options {
  readonly condition?: () => boolean;
  readonly leftClick?: boolean;
  readonly rightClick?: boolean;
  readonly onInput: () => void;
}

class InputHandler extends Definable {
  private readonly _options: Options;

  public constructor(options: Options) {
    super(getToken());
    this._options = options;
  }

  public listen(): void {
    const screen = getDefinable(DOMElement, "screen").getElement();
    if (this._options.leftClick) {
      screen.addEventListener("mousedown", (event: MouseEvent): void => {
        if (event.button === 0) {
          this.attemptInput();
        }
      });
    }
    if (this._options.rightClick) {
      screen.addEventListener("mousedown", (event: MouseEvent): void => {
        if (event.button === 2) {
          this.attemptInput();
        }
      });
    }
  }

  private attemptInput(): void {
    if (typeof this._options.condition === "undefined" || this._options.condition()) {
      this._options.onInput();
    }
  }
}

export default InputHandler;
