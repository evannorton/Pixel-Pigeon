import Definable from "./Definable";
import getToken from "../functions/getToken";

interface Options {
  readonly condition?: () => boolean;
  readonly leftClick?: boolean;
  readonly rightClick?: boolean;
  readonly keys?: string[];
  readonly onInput: () => void;
}

class InputHandler extends Definable {
  private readonly _options: Options;

  public constructor(options: Options) {
    super(getToken());
    this._options = options;
  }

  public handleMousedown(event: MouseEvent): void {
    if ((this._options.leftClick && event.button === 0) || (this._options.rightClick && event.button === 2)) {
      this.attemptInput();
    }
  }

  public handleKeydown(event: KeyboardEvent): void {
    if (typeof this._options.keys !== "undefined" && this._options.keys.includes(event.code)) {
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
