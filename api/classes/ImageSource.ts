import {
  BaseTexture,
  Rectangle,
  RenderTexture,
  Sprite,
  Texture,
} from "pixi.js";
import { Definable } from "./Definable";
import { getHexFromRGB } from "../functions/getHexFromRGB";
import { loadPixiAsset } from "../functions/loadPixiAsset";
import { state } from "../state";

interface ImageSourceOptions {
  readonly imagePath: string;
}

export class ImageSource extends Definable {
  private readonly _colors: string[] = [];
  private readonly _imagePath: string;
  private _texture: Texture | null = null;

  public constructor(options: ImageSourceOptions) {
    super(options.imagePath);
    this._imagePath = options.imagePath;
  }

  public get colors(): string[] {
    return this._colors;
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
        this.loadColors();
      })
      .catch((error: unknown): void => {
        throw error;
      });
  }

  private loadColors(): void {
    if (state.values.app === null) {
      throw new Error(
        `Attempted to load ImageSource "${this._id}" before app was created.`,
      );
    }
    const texture: BaseTexture = this.texture.baseTexture;
    const renderTexture: RenderTexture = RenderTexture.create({
      height: texture.height,
      width: texture.width,
    });
    const rectangle: Rectangle = new Rectangle(
      0,
      0,
      texture.width,
      texture.height,
    );
    const sprite: Sprite = new Sprite(new Texture(texture, rectangle));
    state.values.app.renderer.render(sprite, { renderTexture });
    const pixels: Uint8Array | Uint8ClampedArray =
      state.values.app.renderer.extract.pixels(renderTexture);
    for (let i: number = 0; i < pixels.length; i += 4) {
      const r: number = pixels[i];
      const g: number = pixels[i + 1];
      const b: number = pixels[i + 2];
      const color: string = getHexFromRGB({
        b,
        g,
        r,
      });
      if (this._colors.includes(color) === false) {
        this._colors.push(color);
      }
    }
    sprite.destroy();
    renderTexture.destroy();
  }
}
