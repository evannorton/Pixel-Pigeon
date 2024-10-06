import { Definable, getDefinable } from "definables";
import { ImageSource } from "./ImageSource";
import { NineSlicePlane } from "pixi.js";
import { Scriptable } from "../types/Scriptable";
import { handleCaughtError } from "../functions/handleCaughtError";
import { state } from "../state";

export interface CreateNineSliceOptionsCoordinates {
  /**
   * Callback that decides whether or not coordinates should be used
   */
  condition?: () => boolean;
  /**
   * The X value on the screen where the NineSlice is displayed
   */
  x: Scriptable<number>;
  /**
   * The Y value on the screen where the NineSlice is displayed
   */
  y: Scriptable<number>;
}
/**
 * Information used to decide when an animation should be played for a {@link createNineSlice | NineSlice}
 */
export interface CreateNineSliceOptions {
  bottomHeight: number;
  /**
   * Optional coordinates that can be used to precisely define where the NineSlice should be on the screen
   */
  coordinates: CreateNineSliceOptionsCoordinates;
  height: number;
  /**
   * String path to the sprite sheet, automatically starts in images folder**
   * @example
   * ```ts
   * imagePath: "player", // The actual path to the file is {PROJECTFILE}/images/player.png
   * ```
   */
  imagePath: string;
  leftWidth: number;
  rightWidth: number;
  topHeight: number;
  width: number;
}
interface NineSliceCoordinates {
  readonly condition?: () => boolean;
  readonly x: Scriptable<number>;
  readonly y: Scriptable<number>;
}

export class NineSlice extends Definable {
  private readonly _coordinates?: NineSliceCoordinates;
  private readonly _height: number;
  private readonly _imageSourceID: string;
  private readonly _pixiNineSlicePlane: NineSlicePlane;
  private readonly _width: number;

  public constructor(options: CreateNineSliceOptions) {
    super();
    this._imageSourceID = options.imagePath;
    this._pixiNineSlicePlane = new NineSlicePlane(
      this.imageSource.texture,
      options.leftWidth,
      options.topHeight,
      options.rightWidth,
      options.bottomHeight,
    );
    this._coordinates = {
      condition: options.coordinates.condition,
      x: options.coordinates.x,
      y: options.coordinates.y,
    };
    this._width = options.width;
    this._height = options.height;
  }

  private get imageSource(): ImageSource {
    return getDefinable(ImageSource, this._imageSourceID);
  }

  public drawAtCoordinates(): void {
    if (
      typeof this._coordinates !== "undefined" &&
      this.passesCoordinatesCondition()
    ) {
      const x: number | null = this.getCoordinatesX();
      const y: number | null = this.getCoordinatesY();
      if (x !== null && y !== null) {
        this.drawAtPosition(
          x,
          y,
          100 + this._createOrder / Definable._createOrderCounter,
        );
      }
    }
  }

  public remove(): void {
    super.remove();
    this._pixiNineSlicePlane.destroy();
  }

  private drawAtPosition(x: number, y: number, zIndex: number): void {
    if (state.values.app === null) {
      throw new Error(
        `NineSlice "${this._id}" of ImageSource "${this.imageSource.id}" attempted to draw before app was created.`,
      );
    }
    this._pixiNineSlicePlane.x = x;
    this._pixiNineSlicePlane.y = y;
    this._pixiNineSlicePlane.width = this._width;
    this._pixiNineSlicePlane.height = this._height;
    this._pixiNineSlicePlane.zIndex = zIndex;
    this._pixiNineSlicePlane.filters = [];
    state.values.app.stage.addChild(this._pixiNineSlicePlane);
  }

  private passesCoordinatesCondition(): boolean {
    if (typeof this._coordinates === "undefined") {
      throw new Error(
        `NineSlice "${this._id}" attempted to check coordinates condition with no coordinates.`,
      );
    }
    if (typeof this._coordinates.condition === "undefined") {
      return true;
    }
    try {
      return this._coordinates.condition();
    } catch (error: unknown) {
      handleCaughtError(
        error,
        `NineSlice "${this._id}" coordinates condition`,
        true,
      );
    }
    return false;
  }

  private getCoordinatesX(): number | null {
    if (typeof this._coordinates !== "undefined") {
      if (typeof this._coordinates.x === "number") {
        return this._coordinates.x;
      }
      try {
        return this._coordinates.x();
      } catch (error: unknown) {
        handleCaughtError(error, `NineSlice "${this._id}" coordinates x`, true);
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
        handleCaughtError(error, `NineSlice "${this._id}" coordinates y`, true);
      }
    }
    return null;
  }
}
/**
 * @param options - Creation options for the nine slice
 * @returns String ID of the NineSlice created
 */
export const createNineSlice = (options: CreateNineSliceOptions): string =>
  new NineSlice(options).id;
/**
 * @param nineSliceID - String NineSliceID of the NineSlice to remove
 */
export const removeNineSlice = (nineSliceID: string): void => {
  getDefinable<NineSlice>(NineSlice, nineSliceID).remove();
};
