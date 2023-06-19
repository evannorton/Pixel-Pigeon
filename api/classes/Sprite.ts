import { Assets, Texture } from "pixi.js";
import Definable from "./Definable";
import drawImage from "../functions/draw/drawImage";
import state from "../state";

interface SpriteOptions {
  readonly condition?: () => boolean;
  readonly x: number;
  readonly y: number;
}

class Sprite extends Definable {
  private readonly _options: SpriteOptions;
  private _texture: Texture | null = null;

  public constructor(slug: string, options: SpriteOptions) {
    super(slug);
    this._options = options;
    Assets.load(`./images/${slug}.png`)
      .then((texture: Texture): void => {
        this._texture = texture;
        state.setValues({ loadedAssets: state.values.loadedAssets + 1 });
      })
      .catch((): void => {
        throw new Error(`Sprite "${slug}" could not be loaded.`);
      });
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

  private get texture(): Texture {
    if (this._texture !== null) {
      return this._texture;
    }
    throw new Error(this.getAccessorErrorMessage("texture"));
  }
}

export default Sprite;
