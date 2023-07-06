import { Assets, Texture } from "pixi.js";
import Definable from "./Definable";
import state from "../state";

interface ImageSourceOptions {
  readonly imagePath: string;
}
class ImageSource extends Definable {
  private readonly _options: ImageSourceOptions;
  private _texture: Texture | null = null;

  public constructor(options: ImageSourceOptions) {
    super(options.imagePath);
    this._options = options;
  }

  public get texture(): Texture {
    if (this._texture !== null) {
      return this._texture;
    }
    throw new Error(this.getAccessorErrorMessage("texture"));
  }

  public loadTexture(): void {
    Assets.load(`${location.pathname}images/${this._options.imagePath}.png`)
      .then((texture: Texture): void => {
        this._texture = texture;
        state.setValues({ loadedAssets: state.values.loadedAssets + 1 });
      })
      .catch((error: Error): void => {
        throw error;
      });
  }
}

export default ImageSource;
