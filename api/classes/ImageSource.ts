import { Definable } from "./Definable";
import { Texture } from "pixi.js";
import { loadPixiAsset } from "../functions/loadPixiAsset";

interface ImageSourceOptions {
  readonly imagePath: string;
}

export class ImageSource extends Definable {
  private readonly _imagePath: string;
  private _texture: Texture | null = null;

  public constructor(options: ImageSourceOptions) {
    super(options.imagePath);
    this._imagePath = options.imagePath;
  }

  public get texture(): Texture {
    if (this._texture !== null) {
      return this._texture;
    }
    throw new Error(this.getAccessorErrorMessage("texture"));
  }

  public loadTexture(): void {
    loadPixiAsset(`images/${this._imagePath}.png`)
      .then((texture: Texture): void => {
        this._texture = texture;
      })
      .catch((error: unknown): void => {
        throw error;
      });
  }
}
