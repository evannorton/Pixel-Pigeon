import {
  CameraCoordinates,
  getCameraCoordinates,
} from "../functions/getCameraCoordinates";
import { Definable } from "./Definable";
import { Entity, EntityQuadrilateral } from "../types/World";
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
  coordinates?: {
    /**
     * Callback that decides whether or not coordinates should be used
     */
    condition?: () => boolean;
    /**
     * The X value on the screen where the Quadrilateral is displayed
     */
    x: number | (() => number);
    /**
     * The Y value on the screen where the Quadrilateral is displayed
     */
    y: number | (() => number);
  };
  height: number | (() => number);
  opacity?: number | (() => number);
  width: number | (() => number);
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
    if (
      typeof this._options.coordinates !== "undefined" &&
      this.passesCoordinatesCondition()
    ) {
      const opacity: number | null = this.getOpacity();
      const width: number | null = this.getWidth();
      const height: number | null = this.getHeight();
      const x: number | null = this.getCoordinatesX();
      const y: number | null = this.getCoordinatesY();
      if (
        opacity !== null &&
        width !== null &&
        height !== null &&
        x !== null &&
        y !== null
      ) {
        drawQuadrilateral(
          this._options.color,
          opacity,
          x,
          y,
          width,
          height,
          100,
        );
      }
    }
  }

  public drawAtEntity(
    entity: Entity,
    entityQuadrilateral: EntityQuadrilateral,
    layerIndex: number,
  ): void {
    const zIndex: number = layerIndex + 1 / (1 + Math.exp(-entity.zIndex));
    const cameraCoordinates: CameraCoordinates = getCameraCoordinates();
    const opacity: number | null = this.getOpacity();
    const width: number | null = this.getWidth();
    const height: number | null = this.getHeight();
    if (opacity !== null && width !== null && height !== null) {
      drawQuadrilateral(
        this._options.color,
        opacity,
        Math.floor(entity.position.x) +
          (entityQuadrilateral.x ?? 0) -
          cameraCoordinates.x,
        Math.floor(entity.position.y) +
          (entityQuadrilateral.y ?? 0) -
          cameraCoordinates.y,
        width,
        height,
        zIndex,
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

  private getCoordinatesX(): number | null {
    if (typeof this._options.coordinates !== "undefined") {
      if (typeof this._options.coordinates.x === "number") {
        return this._options.coordinates.x;
      }
      try {
        return this._options.coordinates.x();
      } catch (error: unknown) {
        handleCaughtError(error, `Quadrilateral "${this._id}" x`);
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
        handleCaughtError(error, `Quadrilateral "${this._id}" y`);
      }
    }
    return null;
  }

  private getHeight(): number | null {
    if (typeof this._options.height === "number") {
      return this._options.height;
    }
    try {
      return this._options.height();
    } catch (error: unknown) {
      handleCaughtError(error, `Quadrilateral "${this._id}" height`);
      return null;
    }
  }

  private getOpacity(): number | null {
    if (typeof this._options.opacity !== "undefined") {
      if (typeof this._options.opacity === "number") {
        return this._options.opacity;
      }
      try {
        return this._options.opacity();
      } catch (error: unknown) {
        handleCaughtError(error, `Quadrilateral "${this._id}" opacity`);
        return null;
      }
    }
    return 1;
  }

  private getWidth(): number | null {
    if (typeof this._options.width === "number") {
      return this._options.width;
    }
    try {
      return this._options.width();
    } catch (error: unknown) {
      handleCaughtError(error, `Quadrilateral "${this._id}" width`);
      return null;
    }
  }
}
export const createQuadrilateral = (
  options: CreateQuadrilateralOptions,
): string => new Quadrilateral(options).id;
/**
 * @param quadrilateralID - String QuadrilateralID of the sprite to remove
 */
export const removeQuadrilateral = (quadrilateralID: string): void => {
  getDefinable<Quadrilateral>(Quadrilateral, quadrilateralID).remove();
};
