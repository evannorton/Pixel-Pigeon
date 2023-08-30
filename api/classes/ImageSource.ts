import { Definable } from "pigeon-mode-game-framework/api/classes/Definable";
import { Texture } from "pixi.js";
import { loadPixiAsset } from "pigeon-mode-game-framework/api/functions/loadPixiAsset";

interface ImageSourceOptions {
  readonly imagePath: string;
}

export class ImageSource extends Definable {
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
    loadPixiAsset(`images/${this._options.imagePath}.png`)
      .then((texture: Texture): void => {
        this._texture = texture;
      })
      .catch((error: Error): void => {
        throw error;
      });
  }
}
