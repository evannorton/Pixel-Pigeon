import {
  CameraCoordinates,
  getCameraCoordinates,
} from "pigeon-mode-game-framework/api/functions/getCameraCoordinates";
import { Definable } from "pigeon-mode-game-framework/api/classes/Definable";
import {
  Sprite,
  SpriteOptionsAnimation,
  SpriteOptionsAnimationFrame,
} from "pigeon-mode-game-framework/api/classes/Sprite";
import { Entity as WorldLevelLayerEntity } from "pigeon-mode-game-framework/api/types/World";
import { drawImage } from "pigeon-mode-game-framework/api/functions/draw/drawImage";
import { getDefinable } from "pigeon-mode-game-framework/api/functions/getDefinable";
import { getToken } from "pigeon-mode-game-framework/api/functions/getToken";
import { state } from "pigeon-mode-game-framework/api/state";

/**
 * Information used to decide when an animation should be played for a {@link createSpriteInstance | SpriteInstance}
 */
interface SpriteInstanceOptions<AnimationID extends string> {
  /**
   * Optional coordinates that can be used to preciesly define where the SpriteInstance should be in the world
   */
  readonly coordinates?: {
    /**
     * Callback that decides whether or not coordinates should be used
     */
    readonly condition?: () => boolean;
    /**
     * The X value in the world where the SpriteInstance is displayed
     */
    readonly x: number;
    /**
     * The Y value in the world where the SpriteInstance is displayed
     */
    readonly y: number;
  };
  /**
   * Callback that should decide what animation should be playing at any given moment, and then return the AnimationID so it can be played
   */
  readonly getAnimationID: () => AnimationID | null;
  /**
   * String SpriteID used to refer to the SpriteInstance
   */
  readonly spriteID: string;
}

export class SpriteInstance<AnimationID extends string> extends Definable {
  private _animation: {
    readonly id: string;
    readonly startedAt: number;
  } | null = null;

  private readonly _options: SpriteInstanceOptions<AnimationID>;

  public constructor(options: SpriteInstanceOptions<AnimationID>) {
    super(getToken());
    this._options = options;
  }

  private get sprite(): Sprite<AnimationID> {
    return getDefinable(Sprite<AnimationID>, this._options.spriteID);
  }

  public playAnimation(): void {
    const animationID: AnimationID | null = this._options.getAnimationID();
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
      (typeof this._options.coordinates.condition === "undefined" ||
        this._options.coordinates.condition())
    ) {
      this.drawAtPosition(
        this._options.coordinates.x,
        this._options.coordinates.y,
        2,
      );
    }
  }

  public drawAtEntity(
    entity: WorldLevelLayerEntity<string>,
    layerIndex: number,
  ): void {
    const cameraCoordinates: CameraCoordinates = getCameraCoordinates();
    if (entity.position !== null) {
      this.drawAtPosition(
        Math.floor(entity.position.x) - cameraCoordinates.x,
        Math.floor(entity.position.y) - cameraCoordinates.y,
        layerIndex + 1 / (1 + Math.exp(-entity.zIndex)),
      );
    }
  }

  private drawAtPosition(x: number, y: number, zIndex: number): void {
    if (this._animation === null) {
      throw new Error(
        `SpriteInstance "${this._id}" of ImageSource "${this.sprite.imageSource.id}" attempted to draw with no animation.`,
      );
    }
    const animation: SpriteInstance<AnimationID>["_animation"] =
      this._animation;
    const currentAnimation: SpriteOptionsAnimation<AnimationID> | null =
      this.sprite.animations.find(
        (
          spriteInstanceAnimation: SpriteOptionsAnimation<AnimationID>,
        ): boolean => spriteInstanceAnimation.id === animation.id,
      ) ?? null;
    if (currentAnimation === null) {
      throw new Error(
        `SpriteInstance "${this._id}" does not contain an animation with ID "${this._animation.id}".`,
      );
    }
    const animationContainsEndlessFrame: boolean = currentAnimation.frames.some(
      (frame: SpriteOptionsAnimationFrame): boolean =>
        typeof frame.duration === "undefined",
    );
    const animationDuration: number = currentAnimation.frames.reduce(
      (accumulator: number, frame: SpriteOptionsAnimationFrame): number =>
        accumulator + (frame.duration ?? 0),
      0,
    );
    const timeSinceAnimationStarted: number =
      state.values.currentTime - this._animation.startedAt;
    const animationTime: number = animationContainsEndlessFrame
      ? timeSinceAnimationStarted
      : timeSinceAnimationStarted % animationDuration;
    const currentAnimationFrame: SpriteOptionsAnimationFrame | null =
      currentAnimation.frames.find(
        (frame: SpriteOptionsAnimationFrame, frameIndex: number): boolean => {
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
                      loopedFrame: SpriteOptionsAnimationFrame,
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
                    loopedFrame: SpriteOptionsAnimationFrame,
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
        `SpriteInstance "${this._id}" could not get the current frame for animation "${this._animation.id}".`,
      );
    }
    drawImage(
      this.sprite.imageSource.texture,
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
}

/**
 * Creates a new SpriteInstance. SpriteInstances are the actual sprites that are displayed in the world, 
 * while {@link createSprite | Sprites} just has the underlying data of the animation frames and imagePath.
 * Sprites contain no state and are just data, while SpriteInstances have state, and reference Sprites to play animations.
 * @param options - Creation options for the sprite
 * @returns String ID of the SpriteInstance created
 */
export const createSpriteInstance = <AnimationID extends string>(
  options: SpriteInstanceOptions<AnimationID>,
): string => new SpriteInstance(options).id;
export const removeSpriteInstance = <AnimationID extends string>(
  spriteInstanceID: string,
): void => {
  getDefinable<SpriteInstance<AnimationID>>(
    SpriteInstance<AnimationID>,
    spriteInstanceID,
  ).remove();
};
