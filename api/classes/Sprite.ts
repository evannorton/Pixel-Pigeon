import { Definable } from "./Definable";
import { ImageSource } from "./ImageSource";
import { getDefinable } from "../functions/getDefinable";
import { getToken } from "../functions/getToken";

export interface SpriteOptionsAnimationFrame {
  readonly duration?: number;
  readonly height: number;
  readonly sourceHeight: number;
  readonly sourceWidth: number;
  readonly sourceX: number;
  readonly sourceY: number;
  readonly width: number;
}
export interface SpriteOptionsAnimation<AnimationID extends string> {
  readonly id: AnimationID;
  readonly frames: SpriteOptionsAnimationFrame[];
}
export interface SpriteOptions<AnimationID extends string> {
  readonly animations: SpriteOptionsAnimation<AnimationID>[];
  readonly imagePath: string;
}
export class Sprite<AnimationID extends string> extends Definable {
  private readonly _options: SpriteOptions<AnimationID>;

  public constructor(options: SpriteOptions<AnimationID>) {
    const animationIDs: AnimationID[] = [];
    for (const animation of options.animations) {
      if (animationIDs.includes(animation.id)) {
        throw new Error(
          `Sprite "${options.imagePath}" contains multiple animations with ID "${animation.id}".`
        );
      }
      animationIDs.push(animation.id);
    }
    super(getToken());
    this._options = options;
  }

  public get animations(): SpriteOptionsAnimation<AnimationID>[] {
    return [...this._options.animations];
  }

  public get imageSource(): ImageSource {
    return getDefinable(ImageSource, this._options.imagePath);
  }
}
export const createSprite = <AnimationID extends string>(
  options: SpriteOptions<AnimationID>
): string => new Sprite<AnimationID>(options).id;
