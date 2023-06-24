import { Assets, Texture } from "pixi.js";
import Definable from "./Definable";
import drawImage from "../functions/draw/drawImage";
import getToken from "../functions/getToken";
import state from "../state";

interface SpriteOptions {
  readonly condition?: () => boolean;
  readonly imagePath: string;
  readonly x: number;
  readonly y: number;
}

class Sprite extends Definable {
  private readonly _options: SpriteOptions;
  private _texture: Texture | null = null;

  public constructor(options: SpriteOptions) {
    if (state.values.isInitialized) {
      throw new Error("A Definable was attempted to be constructed after initialization.");
    }
    super(getToken());
    this._options = options;
  }

  public attemptDraw(): void {
    if (
      typeof this._options.condition === "undefined" ||
      this._options.condition()
    ) {
      drawImage(
        this.texture,
        1,
        0,
        0,
        this.texture.width,
        this.texture.height,
        this._options.x,
        this._options.y,
        this.texture.width,
        this.texture.height
      );
    }
  }

  public loadTexture(): void {
    Assets.load(`./images/${this._options.imagePath}.png`)
      .then((texture: Texture): void => {
        this._texture = texture;
        state.setValues({ loadedAssets: state.values.loadedAssets + 1 });
      })
      .catch((e): void => {
        throw e;
      });
  }

  private get texture(): Texture {
    if (this._texture !== null) {
      return this._texture;
    }
    throw new Error(this.getAccessorErrorMessage("texture"));
  }
}

export default Sprite;
