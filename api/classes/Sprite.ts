import { Definable } from "pigeon-mode-game-framework/api/classes/Definable";
import { ImageSource } from "pigeon-mode-game-framework/api/classes/ImageSource";
import { getDefinable } from "pigeon-mode-game-framework/api/functions/getDefinable";
import { getToken } from "pigeon-mode-game-framework/api/functions/getToken";

/**
 * Defines a specific frame in a sprite's Animation
 * To do this you must have a sprite sheet, and define the bounds for each different animation frame
 */
export interface CreateSpriteOptionsAnimationFrame {
  /**
   * The amount of time the specific frame should play for. Leave blank to create a frame that doesn't end
   */
  readonly duration?: number;
  /**
   * Height of the sprite within the game world
   */
  readonly height: number;
  /**
   * Height of the sprite on the provided image sheet
   */
  readonly sourceHeight: number;
  /**
   * Width of the sprite on the provided image sheet
   */
  readonly sourceWidth: number;
  /**
   * The X coordinate of the sprite on the provided image sheet
   */
  readonly sourceX: number;
  /**
   * The Y coordinate of the sprite on the provided image sheet
   */
  readonly sourceY: number;
  /**
   * Width of the sprite within the game world
   */
  readonly width: number;
}
/**
 * A combination of {@link CreateSpriteOptionsAnimationFrame | SpriteAnimationFrames} and an string AnimationID to form a completed animation
 */
export interface CreateSpriteOptionsAnimation<AnimationID extends string> {
  /**
   * String AnimationID that will be used to refer to the animation
   */
  readonly id: AnimationID;
  /**
   * Array of AnimationFrames used to create the overall animation
   */
  readonly frames: CreateSpriteOptionsAnimationFrame[];
}
/**
 * A combination of multiple {@link CreateSpriteOptionsAnimation | SpriteAnimations} and a sprite sheet to create an overall sprite
 */
export interface CreateSpriteOptions<AnimationID extends string> {
  /**
   * Array of Animations that are able to be indentified by their AnimationID to play the animation
   */
  readonly animations: CreateSpriteOptionsAnimation<AnimationID>[];
  /**
   * String path to the sprite sheet. **AUOMATICALLY STARTS IN IMAGES FOLDER**
   * @example
   * ```ts
   * imagePath: "player", // The actual path to the file is {PROJECTFILE}/images/player.png
   * ```
   */
  readonly imagePath: string;
}
export class Sprite<AnimationID extends string> extends Definable {
  private readonly _options: CreateSpriteOptions<AnimationID>;

  public constructor(options: CreateSpriteOptions<AnimationID>) {
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

  public get animations(): CreateSpriteOptionsAnimation<AnimationID>[] {
    return [...this._options.animations];
  }

  public get imageSource(): ImageSource {
    return getDefinable(ImageSource, this._options.imagePath);
  }
}
/**
 * Create a Sprite that holds information about animations based on a sprite sheet.
 * Sprites themselves cannot be used as they simply hold data of the animations and image path.
 * To use a sprite on an entity, you must turn it into a {@link createSpriteInstance | SpriteInstance}.
 * @param options - Options that defines a sprite's image path and animations
 * @returns String SpriteID that can be used to reference the sprite
 */
export const createSprite = <AnimationID extends string>(
  options: CreateSpriteOptions<AnimationID>,
): string => new Sprite(options).id;
