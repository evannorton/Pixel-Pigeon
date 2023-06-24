import Definable from "./Definable";
import drawRectangle from "../functions/draw/drawRectangle";

interface EntityOptions {
  readonly color: string;
  readonly height: number;
  readonly id: string;
  readonly width: number;
}
class Entity extends Definable {
  private readonly _options: EntityOptions;

  public constructor(options: EntityOptions) {
    super(options.id);
    this._options = options;
  }

  public draw(x: number, y: number): void {
    drawRectangle(
      this._options.color,
      1,
      x,
      y,
      this._options.width,
      this._options.height
    );
  }
}

export default Entity;
