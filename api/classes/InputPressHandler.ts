import Definable from "./Definable";
import getToken from "../functions/getToken";
import state from "../state";

interface InputPressHandlerOptions {
  readonly condition?: () => boolean;
  readonly gamepadButtons?: number[];
  readonly keys?: string[];
  readonly leftClick?: boolean;
  readonly onInput: () => void;
  readonly rightClick?: boolean;
}
class InputPressHandler extends Definable {
  private readonly _options: InputPressHandlerOptions;

  public constructor(options: InputPressHandlerOptions) {
    if (state.values.isInitialized) {
      throw new Error(
        "A Definable was attempted to be constructed after initialization."
      );
    }
    super(getToken());
    this._options = options;
  }

  public handleClick(button: number): void {
    if (
      (Boolean(this._options.leftClick) && button === 0) ||
      (Boolean(this._options.rightClick) && button === 2)
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
    if (
      typeof this._options.gamepadButtons !== "undefined" &&
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
const addInputPressHandler = (options: InputPressHandlerOptions): void => {
  new InputPressHandler(options);
};

export default InputPressHandler;
export { addInputPressHandler };
