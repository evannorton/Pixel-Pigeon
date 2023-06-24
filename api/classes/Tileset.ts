import { Assets, Texture } from "pixi.js";
import Definable from "./Definable";
import drawImage from "../functions/draw/drawImage";
import state from "../state";

interface TilesetOptions {
  readonly id: string;
  readonly imagePath: string;
  readonly tileHeight: number;
  readonly tileWidth: number;
}
class Tileset extends Definable {
  private readonly _options: TilesetOptions;
  private _texture: Texture | null = null;

  public constructor(options: TilesetOptions) {
    super(options.id);
    this._options = options;
  }

  private get texture(): Texture {
    if (this._texture !== null) {
      return this._texture;
    }
    throw new Error(this.getAccessorErrorMessage("texture"));
  }

  public drawTile(
    unscaledSourceX: number,
    unscaledSourceY: number,
    unscaledX: number,
    unscaledY: number
  ): void {
    const opacity: number = 1;
    const sourceX: number = unscaledSourceX * this._options.tileWidth;
    const sourceY: number = unscaledSourceY * this._options.tileHeight;
    const sourceWidth: number = this._options.tileWidth;
    const sourceHeight: number = this._options.tileHeight;
    const x: number = unscaledX * this._options.tileWidth;
    const y: number = unscaledY * this._options.tileHeight;
    const width: number = this._options.tileWidth;
    const height: number = this._options.tileHeight;
    drawImage(
      this.texture,
      opacity,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      x,
      y,
      width,
      height
    );
  }

  public loadTexture(): void {
    Assets.load(`./images/${this._options.imagePath}.png`)
      .then((texture: Texture): void => {
        this._texture = texture;
        state.setValues({ loadedAssets: state.values.loadedAssets + 1 });
      })
      .catch((error: Error): void => {
        throw error;
      });
  }
}

export default Tileset;
