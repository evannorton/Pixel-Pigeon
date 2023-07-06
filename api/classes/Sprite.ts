import { WorldLayerEntity } from "../types/World";
import Definable from "./Definable";
import ImageSource from "./ImageSource";
import drawImage from "../functions/draw/drawImage";
import getCameraCoordinates, {
  CameraCoordinates,
} from "../functions/getCameraCoordinates";
import getDefinable from "../functions/getDefinable";
import state from "../state";

interface SpriteOptionsAnimationFrame {
  readonly duration?: number;
  readonly height: number;
  readonly sourceHeight: number;
  readonly sourceWidth: number;
  readonly sourceX: number;
  readonly sourceY: number;
  readonly width: number;
}
interface SpriteOptionsAnimation<AnimationID extends string> {
  readonly id: AnimationID;
  readonly frames: SpriteOptionsAnimationFrame[];
}
interface SpriteOptions<AnimationID extends string> {
  readonly animations: SpriteOptionsAnimation<AnimationID>[];
  readonly condition?: () => boolean;
  readonly coordinates?: {
    readonly x: number;
    readonly y: number;
  };
  readonly defaultAnimationID: AnimationID;
  readonly imagePath: string;
}
class Sprite<AnimationID extends string> extends Definable {
  private _animationID: string;
  private _animationStartedAt: number = state.values.currentTime;
  private readonly _options: SpriteOptions<AnimationID>;

  public constructor(options: SpriteOptions<AnimationID>) {
    if (state.values.isInitialized) {
      throw new Error(
        "A Definable was attempted to be constructed after initialization."
      );
    }
    const animationIDs: AnimationID[] = [];
    for (const animation of options.animations) {
      if (animationIDs.includes(animation.id)) {
        throw new Error(
          `Sprite "${options.imagePath}" contains multiple animations with ID "${animation.id}".`
        );
      }
      animationIDs.push(animation.id);
    }
    super(options.imagePath);
    this._options = options;
    this._animationID = options.defaultAnimationID;
  }

  public drawWithOptions(): void {
    if (
      typeof this._options.coordinates !== "undefined" &&
      (typeof this._options.condition === "undefined" ||
        this._options.condition())
    ) {
      this.drawAtPosition(
        this._options.coordinates.x,
        this._options.coordinates.y
      );
    }
  }

  public playAnimation(animationID: AnimationID): void {
    if (animationID !== this._animationID) {
      this._animationID = animationID;
      this._animationStartedAt = state.values.currentTime;
    }
  }

  public drawWithEntity(layerEntity: WorldLayerEntity): void {
    const cameraCoordinates: CameraCoordinates = getCameraCoordinates();
    this.drawAtPosition(
      Math.floor(layerEntity.x) - cameraCoordinates.x,
      Math.floor(layerEntity.y) - cameraCoordinates.y
    );
  }

  private drawAtPosition(x: number, y: number): void {
    const currentAnimation: SpriteOptionsAnimation<AnimationID> | null =
      this._options.animations.find(
        (animation: SpriteOptionsAnimation<AnimationID>): boolean =>
          animation.id === this._animationID
      ) ?? null;
    if (currentAnimation === null) {
      throw new Error(
        `Sprite "${this._options.imagePath}" does not contain an animation with ID "${this._animationID}".`
      );
    }
    const animationContainsEndlessFrame: boolean = currentAnimation.frames.some(
      (frame: SpriteOptionsAnimationFrame): boolean =>
        typeof frame.duration === "undefined"
    );
    const animationDuration: number = currentAnimation.frames.reduce(
      (accumulator: number, frame: SpriteOptionsAnimationFrame): number =>
        accumulator + (frame.duration ?? 0),
      0
    );
    const timeSinceAnimationStarted: number =
      state.values.currentTime - this._animationStartedAt;
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
                      loopedFrame: SpriteOptionsAnimationFrame
                    ): number => accumulator + (loopedFrame.duration ?? 0),
                    0
                  ) + duration
              : 0;
          if (animationTime >= loopedDuration) {
            const nextLoopedDuration: number =
              currentAnimation.frames
                .slice(0, frameIndex)
                .reduce(
                  (
                    accumulator: number,
                    loopedFrame: SpriteOptionsAnimationFrame
                  ): number => accumulator + (loopedFrame.duration ?? 0),
                  0
                ) + duration;
            if (animationTime < nextLoopedDuration) {
              return true;
            }
          }
          return false;
        }
      ) ?? null;
    if (currentAnimationFrame === null) {
      throw new Error(
        `Sprite "${this._options.imagePath}" could not get the current frame for animation "${this._animationID}".`
      );
    }
    drawImage(
      getDefinable(ImageSource, this._options.imagePath).texture,
      1,
      currentAnimationFrame.sourceX,
      currentAnimationFrame.sourceY,
      currentAnimationFrame.sourceWidth,
      currentAnimationFrame.sourceHeight,
      x,
      y,
      currentAnimationFrame.width,
      currentAnimationFrame.height
    );
  }
}
const createSprite = <AnimationID extends string>(
  options: SpriteOptions<AnimationID>
): string => new Sprite<AnimationID>(options).id;

export default Sprite;
export { createSprite };
