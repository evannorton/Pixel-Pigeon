import { Definable } from "./Definable";
import { TextStyleAlign } from "pixi.js";
import { drawText } from "../functions/draw/drawText";
import { getDefinable } from "../functions/getDefinable";
import { getToken } from "../functions/getToken";
import { handleCaughtError } from "../functions/handleCaughtError";
import { state } from "../state";

export interface CreateLabelOptions {
  color: string | (() => string);
  /**
   * Coordinates that can be used to precisely define where the Label should be on the screen
   */
  coordinates: {
    /**
     * Callback that decides whether or not coordinates should be used
     */
    condition?: () => boolean;
    /**
     * The X value on the screen where the Label is displayed
     */
    x: number | (() => number);
    /**
     * The Y value on the screen where the Label is displayed
     */
    y: number | (() => number);
  };
  text: string | (() => string);
  horizontalAlignment: TextStyleAlign;
}
export class Label extends Definable {
  private readonly _options: CreateLabelOptions;

  public constructor(options: CreateLabelOptions) {
    super(getToken());
    this._options = options;
  }

  public drawAtCoordinates(): void {
    if (state.values.config === null) {
      throw new Error(
        `Label "${this._id}" attempted to draw at coordinates before config was loaded.`,
      );
    }
    if (this.passesCoordinatesCondition()) {
      const text: string | null = this.getText();
      const color: string | null = this.getColor();
      const x: number | null = this.getCoordinatesX();
      const y: number | null = this.getCoordinatesY();
      if (text !== null && color !== null && x !== null && y !== null) {
        drawText(
          text,
          color,
          x,
          y,
          1,
          state.values.config.width,
          1,
          this._options.horizontalAlignment,
          100,
        );
      }
    }
  }

  private passesCoordinatesCondition(): boolean {
    if (typeof this._options.coordinates === "undefined") {
      throw new Error(
        `Label "${this._id}" attempted to check coordinates condition with no coordinates.`,
      );
    }
    if (typeof this._options.coordinates.condition === "undefined") {
      return true;
    }
    try {
      return this._options.coordinates.condition();
    } catch (error: unknown) {
      handleCaughtError(error, `Label "${this._id}" coordinates condition`);
    }
    return false;
  }

  private getColor(): string | null {
    if (typeof this._options.color === "string") {
      return this._options.color;
    }
    try {
      return this._options.color();
    } catch (error: unknown) {
      handleCaughtError(error, `Label "${this._id}" color`);
    }
    return null;
  }

  private getCoordinatesX(): number | null {
    if (typeof this._options.coordinates !== "undefined") {
      if (typeof this._options.coordinates.x === "number") {
        return this._options.coordinates.x;
      }
      try {
        return this._options.coordinates.x();
      } catch (error: unknown) {
        handleCaughtError(error, `Label "${this._id}" x`);
      }
    }
    return null;
  }

  private getCoordinatesY(): number | null {
    if (typeof this._options.coordinates !== "undefined") {
      if (typeof this._options.coordinates.y === "number") {
        return this._options.coordinates.y;
      }
      try {
        return this._options.coordinates.y();
      } catch (error: unknown) {
        handleCaughtError(error, `Label "${this._id}" y`);
      }
    }
    return null;
  }

  private getText(): string | null {
    if (typeof this._options.text === "string") {
      return this._options.text;
    }
    try {
      return this._options.text();
    } catch (error: unknown) {
      handleCaughtError(error, `Label "${this._id}" text`);
    }
    return null;
  }
}
export const createLabel = (options: CreateLabelOptions): string =>
  new Label(options).id;
/**
 * @param labelID - String LabelID of the sprite to remove
 */
export const removeLabel = (labelID: string): void => {
  getDefinable<Label>(Label, labelID).remove();
};
