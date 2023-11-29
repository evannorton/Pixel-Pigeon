import { Definable } from "./Definable";
import { drawQuadrilateral } from "../functions/draw/drawQuadrilateral";
import { getDefinable } from "../functions/getDefinable";
import { getToken } from "../functions/getToken";
import { handleCaughtError } from "../functions/handleCaughtError";
import { state } from "../state";

export interface CreateQuadrilateralOptions {
  color: string;
  /**
   * Coordinates that can be used to precisely define where the Quadrilateral should be on the screen
   */
  coordinates: {
    /**
     * Callback that decides whether or not coordinates should be used
     */
    condition?: () => boolean;
    /**
     * The X value on the screen where the Quadrilateral is displayed
     */
    x: number;
    /**
     * The Y value on the screen where the Quadrilateral is displayed
     */
    y: number;
  };
  height: number;
  opacity: number;
  width: number;
}
export class Quadrilateral extends Definable {
  private readonly _options: CreateQuadrilateralOptions;

  public constructor(options: CreateQuadrilateralOptions) {
    super(getToken());
    this._options = options;
  }

  public drawAtCoordinates(): void {
    if (state.values.config === null) {
      throw new Error(
        `Quadrilateral "${this._id}" attempted to draw at coordinates before config was loaded.`,
      );
    }
    if (this.passesCoordinatesCondition()) {
      drawQuadrilateral(
        this._options.color,
        this._options.opacity,
        this._options.coordinates.x,
        this._options.coordinates.y,
        this._options.width,
        this._options.height,
        2,
      );
    }
  }

  private passesCoordinatesCondition(): boolean {
    if (typeof this._options.coordinates === "undefined") {
      throw new Error(
        `Quadrilateral "${this._id}" attempted to check coordinates condition with no coordinates.`,
      );
    }
    if (typeof this._options.coordinates.condition === "undefined") {
      return true;
    }
    try {
      return this._options.coordinates.condition();
    } catch (error: unknown) {
      handleCaughtError(
        error,
        `Quadrilateral "${this._id}" coordinates condition`,
      );
    }
    return false;
  }
}
export const createQuadrilateral = (
  options: CreateQuadrilateralOptions,
): string => new Quadrilateral(options).id;
/**
 * @param labelID - String QuadrilateralID of the sprite to remove
 */
export const removeQuadrilateral = (labelID: string): void => {
  getDefinable<Quadrilateral>(Quadrilateral, labelID).remove();
};
