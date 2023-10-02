import { Definable } from "./Definable";
import { ImageSource } from "../classes/ImageSource";
import { getDefinable } from "../functions/getDefinable";
import { getToken } from "../functions/getToken";

/**
 * Defines a specific frame in a sprite's Animation
 * To do this you must have a sprite sheet, and define the bounds for each different animation frame
 */
export interface CreateSpriteOptionsAnimationFrame {
  /**
   * The amount of time the specific frame should play for. Leave blank to create a frame that doesn't end
   */
  duration?: number;
  /**
   * Height of the sprite within the game world
   */
  height: number;
  /**
   * Height of the sprite on the provided image sheet
   */
  sourceHeight: number;
  /**
   * Width of the sprite on the provided image sheet
   */
  sourceWidth: number;
  /**
   * The X coordinate of the sprite on the provided image sheet
   */
  sourceX: number;
  /**
   * The Y coordinate of the sprite on the provided image sheet
   */
  sourceY: number;
  /**
   * Width of the sprite within the game world
   */
  width: number;
}
/**
 * A combination of {@link CreateSpriteOptionsAnimationFrame | SpriteAnimationFrames} and an string AnimationID to form a completed animation
 */
export interface CreateSpriteOptionsAnimation {
  /**
   * String AnimationID that will be used to refer to the animation
   */
  id: string;
  /**
   * Array of AnimationFrames used to create the overall animation
   */
  frames: CreateSpriteOptionsAnimationFrame[];
}
/**
 * A combination of multiple {@link CreateSpriteOptionsAnimation | SpriteAnimations} and a sprite sheet to create an overall sprite
 */
export interface CreateSpriteOptions {
  /**
   * Array of Animations that are able to be indentified by their AnimationID to play the animation
   */
  animations: CreateSpriteOptionsAnimation[];
  /**
   * String path to the sprite sheet. **AUOMATICALLY STARTS IN IMAGES FOLDER**
   * @example
   * ```ts
   * imagePath: "player", // The actual path to the file is {PROJECTFILE}/images/player.png
   * ```
   */
  imagePath: string;
}
export class Sprite extends Definable {
  private readonly _options: CreateSpriteOptions;

  public constructor(options: CreateSpriteOptions) {
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

  public get animations(): CreateSpriteOptionsAnimation[] {
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
export const createSprite = (options: CreateSpriteOptions): string =>
  new Sprite(options).id;
