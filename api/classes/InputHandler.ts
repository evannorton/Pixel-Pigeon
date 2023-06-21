import Definable from "./Definable";
import getToken from "../functions/getToken";

interface Options {
  readonly condition?: () => boolean;
  readonly leftClick?: boolean;
  readonly rightClick?: boolean;
  readonly keys?: string[];
  readonly gamepadButtons: number[];
  readonly onInput: () => void;
}

class InputHandler extends Definable {
  private readonly _options: Options;

  public constructor(options: Options) {
    super(getToken());
    this._options = options;
  }

  public handleClick(button: number): void {
    if (
      (this._options.leftClick && button === 0) ||
      (this._options.rightClick && button === 2)
    ) {
      this.attemptInput();
    }
  }

  public handleKey(button: string): void {
    if (
      typeof this._options.keys !== "undefined" &&
      this._options.keys.includes(button)
    ) {
      this.attemptInput();
    }
  }

  public handleGamepadButton(button: number): void {
    if (typeof this._options.gamepadButtons !== "undefined" &&
      this._options.gamepadButtons.includes(button)
    ) {
      this.attemptInput();
    }
  }

  private attemptInput(): void {
    if (
      typeof this._options.condition === "undefined" ||
      this._options.condition()
    ) {
      this._options.onInput();
    }
  }
}

export default InputHandler;
