import { Definable } from "./Definable";
import { Scriptable } from "../types/Scriptable";
import { TextInfo, TextInfoTrim } from "../types/TextInfo";
import { TextStyleAlign } from "pixi.js";
import { drawText } from "../functions/draw/drawText";
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
  private readonly _size: number;
  private readonly _text: Scriptable<TextInfo>;
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
    if (typeof options.text === "function") {
      const textFunction: () => CreateLabelOptionsText = options.text;
      this._text = (): TextInfo => {
        const text: CreateLabelOptionsText = textFunction();
        return {
          trims: text.trims ?? [],
          value: text.value,
        };
      };
    } else {
      this._text = {
        trims:
          options.text.trims?.map(
            (trim: CreateLabelOptionsTextTrim): TextInfoTrim => ({
              index: trim.index,
              length: trim.length,
            }),
          ) ?? [],
        value: options.text.value,
      };
    }
  }

  public drawAtCoordinates(): void {
    if (state.values.config === null) {
      throw new Error(
        `Label "${this._id}" attempted to draw at coordinates before config was loaded.`,
      );
    }
    if (this.passesCoordinatesCondition()) {
      const text: TextInfo | null = this.getTextInfo();
      const color: string | null = this.getColor();
      const x: number | null = this.getCoordinatesX();
      const y: number | null = this.getCoordinatesY();
      if (text !== null && color !== null && x !== null && y !== null) {
        drawText(
          text,
          color,
          x,
          y,
          this._size,
          this._maxWidth,
          this._maxLines,
          this._horizontalAlignment,
          100,
        );
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
      return this._text;
    }
    try {
      return this._text();
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
