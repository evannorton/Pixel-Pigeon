import { BitmapText, TextStyleAlign } from "pixi.js";
import { Definable, getDefinable } from "definables";
import { Scriptable } from "../types/Scriptable";
import { TextInfo } from "../types/TextInfo";
import { arraysHaveSameValues } from "../functions/arraysHaveSameValues";
import { getBitmapText } from "../functions/getBitmapText";
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
  readonly condition?: () => boolean;
  readonly x: Scriptable<number>;
  readonly y: Scriptable<number>;
}

export class Label extends Definable {
  private readonly _color: Scriptable<string>;
  private readonly _coordinates: LabelCoordinates;
  private readonly _horizontalAlignment: TextStyleAlign;
  private readonly _maxLines?: number;
  private readonly _maxWidth?: number;
  private _pixiBitmapText: BitmapText | null = null;
  private readonly _size: number;
  private readonly _text: Scriptable<CreateLabelOptionsText>;
  private _lastColor: string | null = null;
  private _lastTextInfo: TextInfo | null = null;
  public constructor(options: CreateLabelOptions) {
    super();
    this._color = options.color;
    this._coordinates = {
      condition: options.coordinates.condition,
      x: options.coordinates.x,
      y: options.coordinates.y,
    };
    this._horizontalAlignment = options.horizontalAlignment;
    this._maxLines = options.maxLines;
    this._maxWidth = options.maxWidth;
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
          this._lastColor !== color ||
          this._lastTextInfo === null ||
          textInfo.value !== this._lastTextInfo.value ||
          arraysHaveSameValues(textInfo.trims, this._lastTextInfo.trims) ===
            false;
        this._lastColor = color;
        this._lastTextInfo = textInfo;
        if (this._pixiBitmapText && shouldRefreshBitmap) {
          this._pixiBitmapText.destroy();
        }
        this._pixiBitmapText = shouldRefreshBitmap
          ? getBitmapText(
              textInfo.value,
              textInfo.trims,
              color,
              this._size,
              this._maxWidth ?? null,
              this._maxLines ?? null,
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
          this._pixiBitmapText.zIndex =
            100 + this._createOrder / Definable._createOrderCounter;
          state.values.app.stage.addChild(this._pixiBitmapText);
        }
      }
    }
  }

  private passesCoordinatesCondition(): boolean {
    if (typeof this._coordinates.condition === "undefined") {
      return true;
    }
    try {
      return this._coordinates.condition();
    } catch (error: unknown) {
      handleCaughtError(
        error,
        `Label "${this._id}" coordinates condition`,
        true,
      );
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
      handleCaughtError(error, `Label "${this._id}" color`, true);
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
      handleCaughtError(error, `Label "${this._id}" coordinates x`, true);
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
      handleCaughtError(error, `Label "${this._id}" coordinates y`, true);
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
      handleCaughtError(error, `Label "${this._id}" text`, true);
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
