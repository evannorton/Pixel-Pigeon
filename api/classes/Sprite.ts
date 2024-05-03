import {
  CameraCoordinates,
  getCameraCoordinates,
} from "../functions/getCameraCoordinates";
import { Definable } from "./Definable";
import { Entity, EntitySprite } from "../types/World";
import { GrayscaleFilter } from "@pixi/filter-grayscale";
import { ImageSource } from "./ImageSource";
import { MultiColorReplaceFilter } from "@pixi/filter-multi-color-replace";
import { Sprite as PixiSprite, Rectangle, Texture } from "pixi.js";
import { RGB } from "../types/RGB";
import { Scriptable } from "../types/Scriptable";
import { TilePosition } from "../types/TilePosition";
import { drawQuadrilateral } from "../functions/draw/drawQuadrilateral";
import { getDefinable } from "../functions/getDefinable";
import { getRGBFromHex } from "../functions/getRGBFromHex";
import { getToken } from "../functions/getToken";
import { handleCaughtError } from "../functions/handleCaughtError";
import { state } from "../state";

export interface CreateSpriteOptionsRecolor {
  fromColor: string;
  toColor: string;
}
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
export interface CreateSpriteOptionsCoordinates {
  /**
   * Callback that decides whether or not coordinates should be used
   */
  condition?: () => boolean;
  /**
   * The X value on the screen where the Sprite is displayed
   */
  x: Scriptable<number>;
  /**
   * The Y value on the screen where the Sprite is displayed
   */
  y: Scriptable<number>;
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
  animationID: Scriptable<string>;
  animationStartedAt?: Scriptable<number>;
  /**
   * Array of Animations that are able to be indentified by their AnimationID to play the animation
   */
  animations: CreateSpriteOptionsAnimation[];
  /**
   * Optional coordinates that can be used to precisely define where the Sprite should be on the screen
   */
  coordinates?: CreateSpriteOptionsCoordinates;
  /**
   * String path to the sprite sheet, automatically starts in images folder**
   * @example
   * ```ts
   * imagePath: "player", // The actual path to the file is {PROJECTFILE}/images/player.png
   * ```
   */
  isGrayscale?: Scriptable<boolean>;
  imagePath: Scriptable<string>;
  palette?: Scriptable<string[]>;
  recolors?: Scriptable<CreateSpriteOptionsRecolor[]>;
}
interface SpriteRecolor {
  readonly fromColor: string;
  readonly toColor: string;
}
interface SpriteAnimationPlay {
  readonly id: string;
  readonly startedAt: number;
}
interface SpriteCoordinates {
  readonly condition?: () => boolean;
  readonly x: Scriptable<number>;
  readonly y: Scriptable<number>;
}
interface SpriteAnimationFrame {
  readonly duration?: number;
  readonly height: number;
  readonly sourceHeight: number;
  readonly sourceWidth: number;
  readonly sourceX: number;
  readonly sourceY: number;
  texture?: Texture;
  readonly width: number;
}
interface SpriteAnimation {
  readonly id: string;
  readonly frames: SpriteAnimationFrame[];
}

export class Sprite extends Definable {
  private _animationPlay: SpriteAnimationPlay | null = null;

  private readonly _animationID: Scriptable<string>;
  private readonly _animationStartedAt?: Scriptable<number>;
  private readonly _animations: SpriteAnimation[];
  private readonly _coordinates?: SpriteCoordinates;
  private readonly _isGrayscale: Scriptable<boolean> = false;
  private readonly _imageSourceID: Scriptable<string>;
  private readonly _palette: Scriptable<string[]> = [];
  private readonly _pixiSprite: PixiSprite = new PixiSprite();
  private readonly _recolors: Scriptable<SpriteRecolor[]>;

  public constructor(options: CreateSpriteOptions) {
    super(getToken());
    const animationIDs: string[] = [];
    this._imageSourceID = options.imagePath;
    for (const animation of options.animations) {
      if (animationIDs.includes(animation.id)) {
        throw new Error(
          `Sprite "${
            this.getImageSourceID() ?? "null"
          }" contains multiple animations with ID "${animation.id}".`,
        );
      }
      animationIDs.push(animation.id);
    }
    this._animationID = options.animationID;
    this._animationStartedAt = options.animationStartedAt;
    this._animations = options.animations.map(
      (animation: CreateSpriteOptionsAnimation): SpriteAnimation => ({
        frames: animation.frames.map(
          (frame: CreateSpriteOptionsAnimationFrame): SpriteAnimationFrame => ({
            duration: frame.duration,
            height: frame.height,
            sourceHeight: frame.sourceHeight,
            sourceWidth: frame.sourceWidth,
            sourceX: frame.sourceX,
            sourceY: frame.sourceY,
            width: frame.width,
          }),
        ),
        id: animation.id,
      }),
    );
    if (typeof options.coordinates !== "undefined") {
      this._coordinates = {
        condition: options.coordinates.condition,
        x: options.coordinates.x,
        y: options.coordinates.y,
      };
    }
    this._isGrayscale = options.isGrayscale ?? false;
    this._palette = Array.isArray(options.palette)
      ? [...options.palette]
      : typeof options.palette === "function"
        ? options.palette
        : [];
    this._recolors = Array.isArray(options.recolors)
      ? options.recolors.map(
          (recolor: CreateSpriteOptionsRecolor): SpriteRecolor => ({
            fromColor: recolor.fromColor,
            toColor: recolor.toColor,
          }),
        )
      : typeof options.recolors === "function"
        ? options.recolors
        : [];
  }

  private get imageSource(): ImageSource | null {
    const imageSourceID: string | null = this.getImageSourceID();
    if (imageSourceID !== null) {
      return getDefinable(ImageSource, imageSourceID);
    }
    return null;
  }

  public playAnimation(): void {
    if (
      typeof this._coordinates === "undefined" ||
      this.passesCoordinatesCondition()
    ) {
      const animationID: string | null = this.getAnimationID();
      if (animationID === null) {
        this._animationPlay = null;
      } else if (
        this._animationPlay === null ||
        animationID !== this._animationPlay.id
      ) {
        const startedAt: number =
          this.getAnimationStartedAt() ?? state.values.currentTime;
        this._animationPlay = {
          id: animationID,
          startedAt,
        };
      }
    }
  }

  public drawAtCoordinates(): void {
    if (
      typeof this._coordinates !== "undefined" &&
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
      state.values.type === "dev" &&
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

  public isAttached(): boolean {
    if (state.values.world === null) {
      throw new Error(
        `Sprite "${this._id}" attempted to check if it was attached before world was loaded.`,
      );
    }
    if (typeof this._coordinates !== "undefined") {
      return true;
    }
    for (const level of state.values.world.levels.values()) {
      for (const layer of level.layers) {
        for (const entity of layer.entities.values()) {
          if (
            entity.sprites.some(
              (sprite: EntitySprite): boolean => sprite.spriteID === this._id,
            )
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  public remove(): void {
    super.remove();
    this._pixiSprite.destroy();
    for (const animation of this._animations) {
      for (const frame of animation.frames) {
        frame.texture?.destroy();
      }
    }
  }

  private drawAtPosition(x: number, y: number, zIndex: number): void {
    if (state.values.app === null) {
      throw new Error(
        `Sprite "${this._id}" of ImageSource "${
          this.imageSource?.id ?? "null"
        }" attempted to draw before app was created.`,
      );
    }
    if (this._animationPlay === null) {
      throw new Error(
        `Sprite "${this._id}" of ImageSource "${
          this.imageSource?.id ?? "null"
        }" attempted to draw with no animation.`,
      );
    }
    const imageSource: ImageSource | null = this.imageSource;
    if (imageSource !== null) {
      for (const animation of this._animations) {
        for (const frame of animation.frames) {
          if (typeof frame.texture === "undefined") {
            frame.texture = new Texture(
              imageSource.texture.baseTexture,
              new Rectangle(
                frame.sourceX,
                frame.sourceY,
                frame.sourceWidth,
                frame.sourceHeight,
              ),
            );
          } else {
            frame.texture.baseTexture = imageSource.texture.baseTexture;
          }
        }
      }
      const animation: SpriteAnimationPlay = this._animationPlay;
      const currentAnimation: SpriteAnimation | null =
        this._animations.find(
          (spriteAnimation: SpriteAnimation): boolean =>
            spriteAnimation.id === animation.id,
        ) ?? null;
      if (currentAnimation === null) {
        throw new Error(
          `Sprite "${this._id}" does not contain an animation with ID "${this._animationPlay.id}".`,
        );
      }
      const animationContainsEndlessFrame: boolean =
        currentAnimation.frames.some(
          (frame: SpriteAnimationFrame): boolean =>
            typeof frame.duration === "undefined",
        );
      const animationDuration: number = currentAnimation.frames.reduce(
        (accumulator: number, frame: SpriteAnimationFrame): number =>
          accumulator + (frame.duration ?? 0),
        0,
      );
      const timeSinceAnimationStarted: number =
        state.values.currentTime - this._animationPlay.startedAt;
      const animationTime: number = animationContainsEndlessFrame
        ? timeSinceAnimationStarted
        : timeSinceAnimationStarted % animationDuration;
      const currentAnimationFrame: SpriteAnimationFrame | null =
        currentAnimation.frames.find(
          (frame: SpriteAnimationFrame, frameIndex: number): boolean => {
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
                        loopedFrame: SpriteAnimationFrame,
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
                      loopedFrame: SpriteAnimationFrame,
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
          `Sprite "${this._id}" could not get the current frame for animation "${this._animationPlay.id}".`,
        );
      }
      if (typeof currentAnimationFrame.texture !== "undefined") {
        this._pixiSprite.texture = currentAnimationFrame.texture;
      }
      this._pixiSprite.x = x;
      this._pixiSprite.y = y;
      this._pixiSprite.width = currentAnimationFrame.width;
      this._pixiSprite.height = currentAnimationFrame.height;
      this._pixiSprite.zIndex = zIndex;
      this._pixiSprite.filters = [];
      const palette: string[] = this.getPallete();
      const filterColors: [number, number][] = [];
      if (palette.length > 0) {
        for (const color of imageSource.colors) {
          const rgb: RGB = getRGBFromHex(color);
          const average: number = (rgb.b + rgb.g + rgb.r) / 3;
          const closestColor: string = [...palette].sort(
            (colorA: string, colorB: string): number => {
              const rgbA: RGB = getRGBFromHex(colorA);
              const rgbB: RGB = getRGBFromHex(colorB);
              const averageA: number = (rgbA.b + rgbA.g + rgbA.r) / 3;
              const averageB: number = (rgbB.b + rgbB.g + rgbB.r) / 3;
              const diffA: number = Math.abs(averageA - average);
              const diffB: number = Math.abs(averageB - average);
              return diffA - diffB;
            },
          )[0];
          filterColors.push([
            Number(`0x${color.substring(1)}`),
            Number(`0x${closestColor.substring(1)}`),
          ]);
        }
      }
      const recolors: SpriteRecolor[] = this.getRecolors();
      if (recolors.length > 0) {
        filterColors.push(
          ...recolors.map((recolor: SpriteRecolor): [number, number] => [
            Number(`0x${recolor.fromColor.substring(1)}`),
            Number(`0x${recolor.toColor.substring(1)}`),
          ]),
        );
      }
      if (filterColors.length > 0) {
        this._pixiSprite.filters.push(
          new MultiColorReplaceFilter(filterColors, 0.005),
        );
      }
      const grayscale: boolean = this.getGrayscale();
      if (grayscale) {
        this._pixiSprite.filters.push(new GrayscaleFilter());
      }
      state.values.app.stage.addChild(this._pixiSprite);
    }
  }

  private passesCoordinatesCondition(): boolean {
    if (typeof this._coordinates === "undefined") {
      throw new Error(
        `Sprite "${this._id}" attempted to check coordinates condition with no coordinates.`,
      );
    }
    if (typeof this._coordinates.condition === "undefined") {
      return true;
    }
    try {
      return this._coordinates.condition();
    } catch (error: unknown) {
      handleCaughtError(error, `Sprite "${this._id}" coordinates condition`);
    }
    return false;
  }

  private getAnimationID(): string | null {
    if (typeof this._animationID === "string") {
      return this._animationID;
    }
    try {
      return this._animationID();
    } catch (error: unknown) {
      handleCaughtError(error, `Sprite "${this._id}" animationID`);
    }
    return null;
  }

  private getAnimationStartedAt(): number | null {
    if (typeof this._animationStartedAt !== "undefined") {
      if (typeof this._animationStartedAt === "number") {
        return this._animationStartedAt;
      }
      try {
        return this._animationStartedAt();
      } catch (error: unknown) {
        handleCaughtError(error, `Sprite "${this._id}" getAnimationStartedAt`);
        return null;
      }
    }
    return null;
  }

  private getCoordinatesX(): number | null {
    if (typeof this._coordinates !== "undefined") {
      if (typeof this._coordinates.x === "number") {
        return this._coordinates.x;
      }
      try {
        return this._coordinates.x();
      } catch (error: unknown) {
        handleCaughtError(error, `Sprite "${this._id}" coordinates x`);
      }
    }
    return null;
  }

  private getCoordinatesY(): number | null {
    if (typeof this._coordinates !== "undefined") {
      if (typeof this._coordinates.y === "number") {
        return this._coordinates.y;
      }
      try {
        return this._coordinates.y();
      } catch (error: unknown) {
        handleCaughtError(error, `Sprite "${this._id}" coordinates y`);
      }
    }
    return null;
  }

  private getGrayscale(): boolean {
    if (typeof this._isGrayscale !== "undefined") {
      if (typeof this._isGrayscale === "boolean") {
        return this._isGrayscale;
      }
      try {
        return this._isGrayscale();
      } catch (error: unknown) {
        handleCaughtError(error, `Sprite "${this._id}" grayscale`);
      }
    }
    return false;
  }

  private getImageSourceID(): string | null {
    if (typeof this._imageSourceID === "string") {
      return this._imageSourceID;
    }
    try {
      return this._imageSourceID();
    } catch (error: unknown) {
      handleCaughtError(error, `Sprite "${this._id}" imageSourceID`);
    }
    return null;
  }

  private getPallete(): string[] {
    if (Array.isArray(this._palette)) {
      return this._palette;
    }
    try {
      return this._palette();
    } catch (error: unknown) {
      handleCaughtError(error, `Sprite "${this._id}" recolors`);
    }
    return [];
  }

  private getRecolors(): SpriteRecolor[] {
    if (Array.isArray(this._recolors)) {
      return this._recolors;
    }
    try {
      return this._recolors();
    } catch (error: unknown) {
      handleCaughtError(error, `Sprite "${this._id}" recolors`);
    }
    return [];
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
 * @param spriteID - String spriteID of the Sprite to remove
 */
export const removeSprite = (spriteID: string): void => {
  getDefinable<Sprite>(Sprite, spriteID).remove();
};
