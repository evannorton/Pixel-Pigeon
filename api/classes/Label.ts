import { Definable } from "./Definable";
import { TextStyleAlign, TextStyleTextBaseline } from "pixi.js";
import { drawText } from "../functions/draw/drawText";
import { getDefinable } from "../functions/getDefinable";
import { getToken } from "../functions/getToken";
import { handleCaughtError } from "../functions/handleCaughtError";
import { state } from "../state";

export interface CreateLabelOptions {
  color: string;
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
    x: number;
    /**
     * The Y value on the screen where the Label is displayed
     */
    y: number;
  };
  getText: () => string;
  horizontalAlignment: TextStyleAlign;
  verticalAlignment: TextStyleTextBaseline;
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
      if (text !== null) {
        drawText(
          text,
          this._options.color,
          this._options.coordinates.x,
          this._options.coordinates.y,
          1,
          state.values.config.width,
          1,
          this._options.horizontalAlignment,
          this._options.verticalAlignment,
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

  private getText(): string | null {
    try {
      return this._options.getText();
    } catch (error: unknown) {
      handleCaughtError(error, `Label "${this._id}" getText`);
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
