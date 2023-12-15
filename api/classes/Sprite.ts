import {
  CameraCoordinates,
  getCameraCoordinates,
} from "../functions/getCameraCoordinates";
import { Definable } from "./Definable";
import { Entity, EntitySprite } from "../types/World";
import { ImageSource } from "./ImageSource";
import { TilePosition } from "../types/TilePosition";
import { drawImage } from "../functions/draw/drawImage";
import { drawQuadrilateral } from "../functions/draw/drawQuadrilateral";
import { getDefinable } from "../functions/getDefinable";
import { getToken } from "../functions/getToken";
import { handleCaughtError } from "../functions/handleCaughtError";
import { state } from "../state";

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
 * Information used to decide when an animation should be played for a {@link createSprite | Sprite}
 */
export interface CreateSpriteOptions {
  animationID: string | (() => string);
  /**
   * Array of Animations that are able to be indentified by their AnimationID to play the animation
   */
  animations: CreateSpriteOptionsAnimation[];
  /**
   * String path to the sprite sheet, automatically starts in images folder**
   * @example
   * ```ts
   * imagePath: "player", // The actual path to the file is {PROJECTFILE}/images/player.png
   * ```
   */
  imagePath: string;
  /**
   * Optional coordinates that can be used to precisely define where the Sprite should be on the screen
   */
  coordinates?: {
    /**
     * Callback that decides whether or not coordinates should be used
     */
    condition?: () => boolean;
    /**
     * The X value on the screen where the Sprite is displayed
     */
    x: number | (() => number);
    /**
     * The Y value on the screen where the Sprite is displayed
     */
    y: number | (() => number);
  };
}
export class Sprite extends Definable {
  private _animation: {
    readonly id: string;
    readonly startedAt: number;
  } | null = null;

  private readonly _options: CreateSpriteOptions;

  public constructor(options: CreateSpriteOptions) {
    super(getToken());
    this._options = options;
    const animationIDs: string[] = [];
    for (const animation of options.animations) {
      if (animationIDs.includes(animation.id)) {
        throw new Error(
          `Sprite "${options.imagePath}" contains multiple animations with ID "${animation.id}".`,
        );
      }
      animationIDs.push(animation.id);
    }
  }

  private get animations(): CreateSpriteOptionsAnimation[] {
    return [...this._options.animations];
  }

  private get imageSource(): ImageSource {
    return getDefinable(ImageSource, this._options.imagePath);
  }

  public playAnimation(): void {
    const animationID: string | null = this.getAnimationID();
    if (animationID === null) {
      this._animation = null;
    } else if (this._animation === null || animationID !== this._animation.id) {
      this._animation = {
        id: animationID,
        startedAt: state.values.currentTime,
      };
    }
  }

  public drawAtCoordinates(): void {
    if (
      typeof this._options.coordinates !== "undefined" &&
      this.passesCoordinatesCondition()
    ) {
      const x: number | null = this.getCoordinatesX();
      const y: number | null = this.getCoordinatesY();
      if (x !== null && y !== null) {
        this.drawAtPosition(x, y, 100);
      }
    }
  }

  public drawAtEntity(
    entity: Entity,
    entitySprite: EntitySprite,
    layerIndex: number,
  ): void {
    if (state.values.type === null) {
      throw new Error(
        "An attempt was made to draw an entity before type was loaded.",
      );
    }
    const cameraCoordinates: CameraCoordinates = getCameraCoordinates();
    const zIndex: number = layerIndex + 1 / (1 + Math.exp(-entity.zIndex));
    this.drawAtPosition(
      Math.floor(entity.position.x) +
        (entitySprite.x ?? 0) -
        cameraCoordinates.x,
      Math.floor(entity.position.y) +
        (entitySprite.y ?? 0) -
        cameraCoordinates.y,
      zIndex,
    );
    if (
      state.values.type === "zip" &&
      state.values.dev !== null &&
      state.values.dev.renderPathing
    ) {
      const path: TilePosition[] | null =
        entity.path !== null ? [...entity.path] : null;
      if (path !== null) {
        if (entity.hasTouchedPathingStartingTile) {
          path.splice(0, 1);
        }
        path.forEach(({ x, y }: TilePosition, pathIndex: number): void => {
          const color: string =
            pathIndex === 0
              ? "#0084ff"
              : pathIndex === path.length - 1
                ? "#139d08"
                : "#000000";
          drawQuadrilateral(
            "#ffffff",
            1,
            Math.round(x * entity.width + entity.width / 4) -
              cameraCoordinates.x,
            Math.round(y * entity.height + entity.height / 4) -
              cameraCoordinates.y,
            entity.width / 2,
            entity.height / 2,
            zIndex,
          );
          drawQuadrilateral(
            color,
            1,
            Math.round(x * entity.width + entity.width / 4) -
              cameraCoordinates.x +
              1,
            Math.round(y * entity.height + entity.height / 4) -
              cameraCoordinates.y +
              1,
            entity.width / 2 - 2,
            entity.height / 2 - 2,
            zIndex,
          );
        });
      }
    }
  }

  private drawAtPosition(x: number, y: number, zIndex: number): void {
    if (this._animation === null) {
      throw new Error(
        `Sprite "${this._id}" of ImageSource "${this.imageSource.id}" attempted to draw with no animation.`,
      );
    }
    const animation: Sprite["_animation"] = this._animation;
    const currentAnimation: CreateSpriteOptionsAnimation | null =
      this.animations.find(
        (spriteAnimation: CreateSpriteOptionsAnimation): boolean =>
          spriteAnimation.id === animation.id,
      ) ?? null;
    if (currentAnimation === null) {
      throw new Error(
        `Sprite "${this._id}" does not contain an animation with ID "${this._animation.id}".`,
      );
    }
    const animationContainsEndlessFrame: boolean = currentAnimation.frames.some(
      (frame: CreateSpriteOptionsAnimationFrame): boolean =>
        typeof frame.duration === "undefined",
    );
    const animationDuration: number = currentAnimation.frames.reduce(
      (accumulator: number, frame: CreateSpriteOptionsAnimationFrame): number =>
        accumulator + (frame.duration ?? 0),
      0,
    );
    const timeSinceAnimationStarted: number =
      state.values.currentTime - this._animation.startedAt;
    const animationTime: number = animationContainsEndlessFrame
      ? timeSinceAnimationStarted
      : timeSinceAnimationStarted % animationDuration;
    const currentAnimationFrame: CreateSpriteOptionsAnimationFrame | null =
      currentAnimation.frames.find(
        (
          frame: CreateSpriteOptionsAnimationFrame,
          frameIndex: number,
        ): boolean => {
          const duration: number | null = frame.duration ?? null;
          if (duration === null) {
            return true;
          }
          const loopedDuration: number =
            frameIndex > 0
              ? currentAnimation.frames
                  .slice(0, frameIndex - 1)
                  .reduce(
                    (
                      accumulator: number,
                      loopedFrame: CreateSpriteOptionsAnimationFrame,
                    ): number => accumulator + (loopedFrame.duration ?? 0),
                    0,
                  ) + duration
              : 0;
          if (animationTime >= loopedDuration) {
            const nextLoopedDuration: number =
              currentAnimation.frames
                .slice(0, frameIndex)
                .reduce(
                  (
                    accumulator: number,
                    loopedFrame: CreateSpriteOptionsAnimationFrame,
                  ): number => accumulator + (loopedFrame.duration ?? 0),
                  0,
                ) + duration;
            if (animationTime < nextLoopedDuration) {
              return true;
            }
          }
          return false;
        },
      ) ?? null;
    if (currentAnimationFrame === null) {
      throw new Error(
        `Sprite "${this._id}" could not get the current frame for animation "${this._animation.id}".`,
      );
    }
    drawImage(
      this.imageSource.texture,
      1,
      currentAnimationFrame.sourceX,
      currentAnimationFrame.sourceY,
      currentAnimationFrame.sourceWidth,
      currentAnimationFrame.sourceHeight,
      x,
      y,
      currentAnimationFrame.width,
      currentAnimationFrame.height,
      zIndex,
    );
  }

  private passesCoordinatesCondition(): boolean {
    if (typeof this._options.coordinates === "undefined") {
      throw new Error(
        `Sprite "${this._id}" attempted to check coordinates condition with no coordinates.`,
      );
    }
    if (typeof this._options.coordinates.condition === "undefined") {
      return true;
    }
    try {
      return this._options.coordinates.condition();
    } catch (error: unknown) {
      handleCaughtError(error, `Sprite "${this._id}" coordinates condition`);
    }
    return false;
  }

  private getAnimationID(): string | null {
    if (typeof this._options.animationID === "string") {
      return this._options.animationID;
    }
    try {
      return this._options.animationID();
    } catch (error: unknown) {
      handleCaughtError(error, `Sprite "${this._id}" animationID`);
    }
    return null;
  }

  private getCoordinatesX(): number | null {
    if (typeof this._options.coordinates !== "undefined") {
      if (typeof this._options.coordinates.x === "number") {
        return this._options.coordinates.x;
      }
      try {
        return this._options.coordinates.x();
      } catch (error: unknown) {
        handleCaughtError(error, `Sprite "${this._id}" coordinates x`);
      }
    }
    return null;
  }

  private getCoordinatesY(): number | null {
    if (typeof this._options.coordinates !== "undefined") {
      if (typeof this._options.coordinates.y === "number") {
        return this._options.coordinates.y;
      }
      try {
        return this._options.coordinates.y();
      } catch (error: unknown) {
        handleCaughtError(error, `Sprite "${this._id}" coordinates y`);
      }
    }
    return null;
  }
}
/**
 * Creates a new Sprite. Sprites are the actual sprites that are displayed in the world,
 * while {@link createSprite | Sprites} just has the underlying data of the animation frames and imagePath.
 * Sprites contain no state and are just data, while Sprites have state, and reference Sprites to play animations.
 * @param options - Creation options for the sprite
 * @returns String ID of the Sprite created
 */
export const createSprite = (options: CreateSpriteOptions): string =>
  new Sprite(options).id;
/**
 * @param spriteID - String spriteID of the sprite to remove
 */
export const removeSprite = (spriteID: string): void => {
  getDefinable<Sprite>(Sprite, spriteID).remove();
};
