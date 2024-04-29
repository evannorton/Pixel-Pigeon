import { BitmapText, TextStyleAlign } from "pixi.js";
import { Definable } from "./Definable";
import { Scriptable } from "../types/Scriptable";
import { TextInfo } from "../types/TextInfo";
import { arraysHaveSameValues } from "../functions/arraysHaveSameValues";
import { getBitmapText } from "../functions/getBitmapText";
import { getDefinable } from "../functions/getDefinable";
import { getToken } from "../functions/getToken";
import { handleCaughtError } from "../functions/handleCaughtError";
import { state } from "../state";

export interface CreateLabelOptionsTextTrim {
  index: number;
  length: number;
}
export interface CreateLabelOptionsText {
  trims?: CreateLabelOptionsTextTrim[];
  value: string;
}
export interface CreateLabelOptionsCoordinates {
  /**
   * Callback that decides whether or not coordinates should be used
   */
  condition?: () => boolean;
  /**
   * The X value on the screen where the Label is displayed
   */
  x: Scriptable<number>;
  /**
   * The Y value on the screen where the Label is displayed
   */
  y: Scriptable<number>;
}
export interface CreateLabelOptions {
  color: Scriptable<string>;
  /**
   * Coordinates that can be used to precisely define where the Label should be on the screen
   */
  coordinates: CreateLabelOptionsCoordinates;
  horizontalAlignment: TextStyleAlign;
  maxLines?: number;
  maxWidth?: number;
  size?: number;
  text: Scriptable<CreateLabelOptionsText>;
}
interface LabelCoordinates {
  readonly condition: (() => boolean) | null;
  readonly x: Scriptable<number>;
  readonly y: Scriptable<number>;
}

export class Label extends Definable {
  private readonly _color: Scriptable<string>;
  private readonly _coordinates: LabelCoordinates;
  private readonly _horizontalAlignment: TextStyleAlign;
  private readonly _maxLines: number | null;
  private readonly _maxWidth: number | null;
  private _pixiBitmapText: BitmapText | null = null;
  private readonly _size: number;
  private readonly _text: Scriptable<CreateLabelOptionsText>;
  private _textInfo: TextInfo | null = null;
  public constructor(options: CreateLabelOptions) {
    super(getToken());
    this._color = options.color;
    this._coordinates = {
      condition: options.coordinates.condition ?? null,
      x: options.coordinates.x,
      y: options.coordinates.y,
    };
    this._horizontalAlignment = options.horizontalAlignment;
    this._maxLines = options.maxLines ?? null;
    this._maxWidth = options.maxWidth ?? null;
    this._size = options.size ?? 1;
    this._text = options.text;
  }

  public drawAtCoordinates(): void {
    if (state.values.app === null) {
      throw new Error(
        `Label "${this._id}" attempted to draw before app was created.`,
      );
    }
    if (state.values.config === null) {
      throw new Error(
        `Label "${this._id}" attempted to draw at coordinates before config was loaded.`,
      );
    }
    if (this.passesCoordinatesCondition()) {
      const textInfo: TextInfo | null = this.getTextInfo();
      const color: string | null = this.getColor();
      const x: number | null = this.getCoordinatesX();
      const y: number | null = this.getCoordinatesY();
      if (textInfo !== null && color !== null && x !== null && y !== null) {
        const shouldRefreshBitmap: boolean =
          this._textInfo === null ||
          textInfo.value !== this._textInfo.value ||
          arraysHaveSameValues(textInfo.trims, this._textInfo.trims) === false;
        this._textInfo = textInfo;
        if (this._pixiBitmapText && shouldRefreshBitmap) {
          this._pixiBitmapText.destroy();
        }
        this._pixiBitmapText = shouldRefreshBitmap
          ? getBitmapText(
              textInfo.value,
              textInfo.trims,
              color,
              this._size,
              this._maxWidth,
              this._maxLines,
              this._horizontalAlignment,
            )
          : this._pixiBitmapText;
        if (this._pixiBitmapText !== null) {
          const startX: number = x - this._size;
          this._pixiBitmapText.x =
            this._horizontalAlignment === "right"
              ? startX - this._pixiBitmapText.width
              : this._horizontalAlignment === "center"
                ? startX - Math.floor(this._pixiBitmapText.width / 2) - 1
                : startX;
          if (
            this._horizontalAlignment === "center" &&
            this._pixiBitmapText.width % 2 === 0
          ) {
            this._pixiBitmapText.x++;
          }
          this._pixiBitmapText.y = y - this._size * 3;
          this._pixiBitmapText.zIndex = 100;
          state.values.app.stage.addChild(this._pixiBitmapText);
        }
      }
    }
  }

  private passesCoordinatesCondition(): boolean {
    if (this._coordinates.condition === null) {
      return true;
    }
    try {
      return this._coordinates.condition();
    } catch (error: unknown) {
      handleCaughtError(error, `Label "${this._id}" coordinates condition`);
    }
    return false;
  }

  private getColor(): string | null {
    if (typeof this._color === "string") {
      return this._color;
    }
    try {
      return this._color();
    } catch (error: unknown) {
      handleCaughtError(error, `Label "${this._id}" color`);
    }
    return null;
  }

  private getCoordinatesX(): number | null {
    if (typeof this._coordinates.x === "number") {
      return this._coordinates.x;
    }
    try {
      return this._coordinates.x();
    } catch (error: unknown) {
      handleCaughtError(error, `Label "${this._id}" coordinates x`);
    }
    return null;
  }

  private getCoordinatesY(): number | null {
    if (typeof this._coordinates.y === "number") {
      return this._coordinates.y;
    }
    try {
      return this._coordinates.y();
    } catch (error: unknown) {
      handleCaughtError(error, `Label "${this._id}" coordinates y`);
    }
    return null;
  }

  private getTextInfo(): TextInfo | null {
    if (typeof this._text === "object") {
      return {
        trims: this._text.trims ?? [],
        value: this._text.value,
      };
    }
    try {
      const text: CreateLabelOptionsText = this._text();
      return {
        trims: text.trims ?? [],
        value: text.value,
      };
    } catch (error: unknown) {
      handleCaughtError(error, `Label "${this._id}" text`);
    }
    return null;
  }
}
export const createLabel = (options: CreateLabelOptions): string =>
  new Label(options).id;
/**
 * @param labelID - String LabelID of the Label to remove
 */
export const removeLabel = (labelID: string): void => {
  getDefinable<Label>(Label, labelID).remove();
};
