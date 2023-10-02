import {
  CameraCoordinates,
  getCameraCoordinates,
} from "../functions/getCameraCoordinates";
import {
  CreateSpriteOptionsAnimation,
  CreateSpriteOptionsAnimationFrame,
  Sprite,
} from "../classes/Sprite";
import { Definable } from "./Definable";
import { TilePosition } from "../types/TilePosition";
import { Entity as WorldLevelLayerEntity } from "../types/World";
import { drawImage } from "../functions/draw/drawImage";
import { drawRectangle } from "../functions/draw/drawRectangle";
import { getDefinable } from "../functions/getDefinable";
import { getToken } from "../functions/getToken";
import { state } from "../state";

/**
 * Information used to decide when an animation should be played for a {@link createSpriteInstance | SpriteInstance}
 */
export interface CreateSpriteInstanceOptions {
  /**
   * Optional coordinates that can be used to preciesly define where the SpriteInstance should be in the world
   */
  coordinates?: {
    /**
     * Callback that decides whether or not coordinates should be used
     */
    condition?: () => boolean;
    /**
     * The X value in the world where the SpriteInstance is displayed
     */
    x: number;
    /**
     * The Y value in the world where the SpriteInstance is displayed
     */
    y: number;
  };
  /**
   * Callback that should decide what animation should be playing at any given moment, and then return the AnimationID so it can be played
   */
  getAnimationID: () => string | null;
  /**
   * String SpriteID used to refer to the SpriteInstance
   */
  spriteID: string;
}
export class SpriteInstance extends Definable {
  private _animation: {
    readonly id: string;
    readonly startedAt: number;
  } | null = null;

  private readonly _options: CreateSpriteInstanceOptions;

  public constructor(options: CreateSpriteInstanceOptions) {
    super(getToken());
    this._options = options;
  }

  private get sprite(): Sprite {
    return getDefinable(Sprite, this._options.spriteID);
  }

  public playAnimation(): void {
    const animationID: string | null = this._options.getAnimationID();
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
    if (state.values.dev === null) {
      throw new Error(
        "An attempt was made to draw an entity before dev was loaded.",
      );
    }
    const cameraCoordinates: CameraCoordinates = getCameraCoordinates();
    if (entity.position !== null) {
      const zIndex: number = layerIndex + 1 / (1 + Math.exp(-entity.zIndex));
      this.drawAtPosition(
        Math.floor(entity.position.x) - cameraCoordinates.x,
        Math.floor(entity.position.y) - cameraCoordinates.y,
        zIndex,
      );
      if (state.values.dev.renderPathing) {
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
            drawRectangle(
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
            drawRectangle(
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
  }

  private drawAtPosition(x: number, y: number, zIndex: number): void {
    if (this._animation === null) {
      throw new Error(
        `SpriteInstance "${this._id}" of ImageSource "${this.sprite.imageSource.id}" attempted to draw with no animation.`,
      );
    }
    const animation: SpriteInstance["_animation"] = this._animation;
    const currentAnimation: CreateSpriteOptionsAnimation | null =
      this.sprite.animations.find(
        (spriteInstanceAnimation: CreateSpriteOptionsAnimation): boolean =>
          spriteInstanceAnimation.id === animation.id,
      ) ?? null;
    if (currentAnimation === null) {
      throw new Error(
        `SpriteInstance "${this._id}" does not contain an animation with ID "${this._animation.id}".`,
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
export const createSpriteInstance = (
  options: CreateSpriteInstanceOptions,
): string => new SpriteInstance(options).id;
/**
 * @param spriteInstanceID - String SpriteInstanceID of the sprite to remove
 */
export const removeSpriteInstance = (spriteInstanceID: string): void => {
  getDefinable<SpriteInstance>(SpriteInstance, spriteInstanceID).remove();
};
