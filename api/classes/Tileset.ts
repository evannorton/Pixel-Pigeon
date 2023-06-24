import { Assets, Texture } from "pixi.js";
import Definable from "./Definable";
import state from "../state";

interface TilesetOptions {
  readonly id: string;
  readonly imagePath: string;
}

class Tileset extends Definable {
  private readonly _options: TilesetOptions;
  private _texture: Texture | null = null;

  public constructor(options: TilesetOptions) {
    super(options.id);
    this._options = options;
    console.log(this._options);
  }

  public loadTexture(): void {
    Assets.load(`./images/${this._options.imagePath}.png`)
      .then((texture: Texture): void => {
        this._texture = texture;
        state.setValues({ loadedAssets: state.values.loadedAssets + 1 });
        console.log(this._texture);
      })
      .catch((e): void => {
        throw e;
      });
  }

}

export default Tileset;