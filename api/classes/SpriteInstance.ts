import {
  CameraCoordinates,
  getCameraCoordinates,
} from "../functions/getCameraCoordinates";
import { Definable } from "./Definable";
import {
  Sprite,
  SpriteOptionsAnimation,
  SpriteOptionsAnimationFrame,
} from "./Sprite";
import { EntityInstance as WorldLevelLayerEntityInstance } from "../types/World";
import { drawImage } from "../functions/draw/drawImage";
import { getDefinable } from "../functions/getDefinable";
import { getToken } from "../functions/getToken";
import { state } from "../state";

interface SpriteInstanceOptions {
  readonly coordinates?: {
    readonly condition?: () => boolean;
    readonly x: number;
    readonly y: number;
  };
  readonly spriteID: string;
}

export class SpriteInstance<AnimationID extends string> extends Definable {
  private _animation: {
    readonly id: string;
    readonly startedAt: number;
  } | null = null;

  private readonly _options: SpriteInstanceOptions;

  public constructor(options: SpriteInstanceOptions) {
    super(getToken());
    this._options = options;
  }

  private get sprite(): Sprite<AnimationID> {
    return getDefinable(Sprite<AnimationID>, this._options.spriteID);
  }

  public playAnimation(animationID: AnimationID): void {
    if (this._animation === null || animationID !== this._animation.id) {
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
      );
    }
  }

  public drawAtEntityInstance(
    entityInstance: WorldLevelLayerEntityInstance,
  ): void {
    const cameraCoordinates: CameraCoordinates = getCameraCoordinates();
    this.drawAtPosition(
      Math.floor(entityInstance.x) - cameraCoordinates.x,
      Math.floor(entityInstance.y) - cameraCoordinates.y,
    );
  }

  private drawAtPosition(x: number, y: number): void {
    if (this._animation === null) {
      throw new Error(
        `SpriteInstance "${this._id}" attempted to draw with no animation.`,
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
    );
  }
}
export const createSpriteInstance = <AnimationID extends string>(
  options: SpriteInstanceOptions,
): string => new SpriteInstance<AnimationID>(options).id;
interface PlaySpriteAnimationOptions<AnimationID extends string> {
  readonly animationID: AnimationID;
}

export const playSpriteInstanceAnimation = <AnimationID extends string>(
  spriteInstanceID: string,
  options: PlaySpriteAnimationOptions<AnimationID>,
): void => {
  const sprite: SpriteInstance<AnimationID> = getDefinable<
    SpriteInstance<AnimationID>
  >(SpriteInstance, spriteInstanceID);
  sprite.playAnimation(options.animationID);
};
export const removeSpriteInstance = <AnimationID extends string>(
  spriteInstanceID: string,
): void => {
  getDefinable<SpriteInstance<AnimationID>>(
    SpriteInstance,
    spriteInstanceID,
  ).remove();
};
