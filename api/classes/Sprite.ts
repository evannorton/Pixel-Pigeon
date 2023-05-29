import Definable from "./Definable";
import state from "../state";
import { Assets, Texture } from "pixi.js";

interface SpriteOptions {
  readonly x: number;
  readonly y: number;
}

class Sprite extends Definable {
  private _options: SpriteOptions
  private _texture: Texture | null = null;

  public constructor(slug: string, options: SpriteOptions) {
    super(slug);
    this._options = options;
    Assets.load(`./images/${slug}.png`).then((texture): void => {
      this._texture = texture;
      state.loadedAssets++;
    });
  }

  public get options(): SpriteOptions {
    return {
      ...this._options
    };
  }

  public get texture(): Texture {
    if (this._texture !== null) {
      return this._texture;
    }
    throw new Error(this.getAccessorErrorMessage("texture"));
  }
}

export default Sprite;