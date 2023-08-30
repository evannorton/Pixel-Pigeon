import { Definable } from "pigeon-mode-game-framework/api/classes/Definable";
import { ImageSource } from "pigeon-mode-game-framework/api/classes/ImageSource";
import { getDefinable } from "pigeon-mode-game-framework/api/functions/getDefinable";
import { getToken } from "pigeon-mode-game-framework/api/functions/getToken";

export interface SpriteOptionsAnimationFrame {
  readonly duration?: number;
  readonly height: number;
  readonly sourceHeight: number;
  readonly sourceWidth: number;
  readonly sourceX: number;
  readonly sourceY: number;
  readonly width: number;
}
export interface SpriteOptionsAnimation {
  readonly id: string;
  readonly frames: SpriteOptionsAnimationFrame[];
}
export interface SpriteOptions {
  readonly animations: SpriteOptionsAnimation[];
  readonly imagePath: string;
}
export class Sprite extends Definable {
  private readonly _options: SpriteOptions;

  public constructor(options: SpriteOptions) {
    const animationIDs: string[] = [];
    for (const animation of options.animations) {
      if (animationIDs.includes(animation.id)) {
        throw new Error(
          `Sprite "${options.imagePath}" contains multiple animations with ID "${animation.id}".`,
        );
      }
      animationIDs.push(animation.id);
    }
    super(getToken());
    this._options = options;
  }

  public get animations(): SpriteOptionsAnimation[] {
    return [...this._options.animations];
  }

  public get imageSource(): ImageSource {
    return getDefinable(ImageSource, this._options.imagePath);
  }
}
export const createSprite = (options: SpriteOptions): string =>
  new Sprite(options).id;
