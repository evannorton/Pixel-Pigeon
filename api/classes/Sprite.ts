import { Assets, Texture } from "pixi.js";
import { WorldLayerEntity } from "../types/World";
import Definable from "./Definable";
import drawImage from "../functions/draw/drawImage";
import getCameraCoordinates, {
  CameraCoordinates,
} from "../functions/getCameraCoordinates";
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
  readonly defaultAnimationID: AnimationID;
  readonly imagePath: string;
  readonly x?: number;
  readonly y?: number;
}
class Sprite<AnimationID extends string> extends Definable {
  private _animationID: string;
  private _animationStartedAt: number = state.values.currentTime;
  private readonly _options: SpriteOptions<AnimationID>;
  private _texture: Texture | null = null;

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

  private get texture(): Texture {
    if (this._texture !== null) {
      return this._texture;
    }
    throw new Error(this.getAccessorErrorMessage("texture"));
  }

  public drawWithOptions(): void {
    if (
      typeof this._options.condition === "undefined" ||
      this._options.condition()
    ) {
      if (
        typeof this._options.x !== "undefined" &&
        typeof this._options.y !== "undefined"
      ) {
        this.drawAtPosition(this._options.x, this._options.y);
      }
    }
  }

  public drawWithEntity(layerEntity: WorldLayerEntity): void {
    const cameraCoordinates: CameraCoordinates = getCameraCoordinates();
    this.drawAtPosition(
      Math.floor(layerEntity.x) - cameraCoordinates.x,
      Math.floor(layerEntity.y) - cameraCoordinates.y
    );
  }

  public loadTexture(): void {
    Assets.load(`./images/${this._options.imagePath}.png`)
      .then((texture: Texture): void => {
        this._texture = texture;
        state.setValues({ loadedAssets: state.values.loadedAssets + 1 });
      })
      .catch((error: Error): void => {
        throw error;
      });
  }

  public playAnimation(animationID: AnimationID): void {
    this._animationID = animationID;
    this._animationStartedAt = state.values.currentTime;
    console.log(this._animationStartedAt);
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
    const currentAnimationFrame: SpriteOptionsAnimationFrame | null =
      currentAnimation.frames.find(
        (frame: SpriteOptionsAnimationFrame): boolean => {
          const duration: number | null = frame.duration ?? null;
          if (duration === null) {
            return true;
          }
          // TODO: Choose frame based on duration
          return true;
        }
      ) ?? null;
    if (currentAnimationFrame === null) {
      throw new Error(
        `Sprite "${this._options.imagePath}" could not get the current frame for animation "${this._animationID}".`
      );
    }
    drawImage(
      this.texture,
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
const addSprite = <AnimationID extends string>(
  options: SpriteOptions<AnimationID>
): void => {
  new Sprite<AnimationID>(options);
};

export default Sprite;
export { addSprite };
