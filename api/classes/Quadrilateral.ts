import {
  CameraCoordinates,
  getCameraCoordinates,
} from "../functions/getCameraCoordinates";
import { Definable, getDefinable } from "definables";
import { Entity } from "./Entity";
import { EntityQuadrilateral } from "../types/World";
import { Graphics } from "pixi.js";
import { Scriptable } from "../types/Scriptable";
import { getRangeNormalizedNumber } from "../functions/getRangeNormalizedNumber";
import { handleCaughtError } from "../functions/handleCaughtError";
import { state } from "../state";

export interface CreateQuadrilateralOptionsCoordinates {
  /**
   * Callback that decides whether or not coordinates should be used
   */
  condition?: () => boolean;
  /**
   * The X value on the screen where the Quadrilateral is displayed
   */
  x: Scriptable<number>;
  /**
   * The Y value on the screen where the Quadrilateral is displayed
   */
  y: Scriptable<number>;
}
export interface CreateQuadrilateralOptions {
  color: string;
  /**
   * Coordinates that can be used to precisely define where the Quadrilateral should be on the screen
   */
  coordinates?: CreateQuadrilateralOptionsCoordinates;
  height: Scriptable<number>;
  opacity?: Scriptable<number>;
  width: Scriptable<number>;
}
interface QuadrilateralCoordinates {
  readonly condition?: () => boolean;
  readonly x: Scriptable<number>;
  readonly y: Scriptable<number>;
}
interface QuadrilateralEntity {
  entityID: string;
  entityQuadrilateral: EntityQuadrilateral;
}

export class Quadrilateral extends Definable {
  private readonly _color: string;
  private readonly _coordinates?: QuadrilateralCoordinates;
  private _entity: QuadrilateralEntity | null = null;
  private readonly _height: Scriptable<number>;
  private readonly _opacity: Scriptable<number>;
  private readonly _pixiGraphics: Graphics = new Graphics();
  private readonly _width: Scriptable<number>;
  public constructor(options: CreateQuadrilateralOptions) {
    super();
    this._color = options.color;
    if (typeof options.coordinates !== "undefined") {
      this._coordinates = {
        condition: options.coordinates.condition,
        x: options.coordinates.x,
        y: options.coordinates.y,
      };
    }
    this._height = options.height;
    this._opacity = options.opacity ?? 1;
    this._width = options.width;
  }

  public get entity(): QuadrilateralEntity {
    if (this._entity !== null) {
      return this._entity;
    }
    throw new Error(this.getAccessorErrorMessage("entity"));
  }

  public set entity(entity: QuadrilateralEntity | null) {
    this._entity = entity;
  }

  public clear(): void {
    this._pixiGraphics.clear();
  }

  public drawAtCoordinates(): void {
    if (state.values.config === null) {
      throw new Error(
        `Quadrilateral "${this._id}" attempted to draw at coordinates before config was loaded.`,
      );
    }
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

  public drawAtEntity(
    entityID: string,
    entityQuadrilateral: EntityQuadrilateral,
    layerIndex: number,
  ): void {
    const entity: Entity = getDefinable(Entity, entityID);
    const zIndex: number = getRangeNormalizedNumber(
      entity.zIndex,
      layerIndex,
      layerIndex + 1,
    );
    const cameraCoordinates: CameraCoordinates = getCameraCoordinates();
    const x: number =
      Math.floor(entity.position.x) +
      (entityQuadrilateral.x ?? 0) -
      cameraCoordinates.x;
    const y: number =
      Math.floor(entity.position.y) +
      (entityQuadrilateral.y ?? 0) -
      cameraCoordinates.y;
    this.drawAtPosition(x, y, zIndex);
  }

  public isAttached(): boolean {
    if (typeof this._coordinates !== "undefined") {
      return true;
    }
    if (this._entity !== null) {
      return true;
    }
    return false;
  }

  public remove(): void {
    super.remove();
    this._pixiGraphics.destroy();
  }

  private drawAtPosition(x: number, y: number, zIndex: number): void {
    if (state.values.app === null) {
      throw new Error(
        `Quadrilateral "${this._id}" attempted to draw before app was created.`,
      );
    }
    const opacity: number | null = this.getOpacity();
    const width: number | null = this.getWidth();
    const height: number | null = this.getHeight();
    if (opacity !== null && width !== null && height !== null) {
      this._pixiGraphics.beginFill(Number(`0x${this._color.substring(1)}`));
      this._pixiGraphics.lineStyle(0, Number(`0x${this._color.substring(1)}`));
      this._pixiGraphics.drawRect(x, y, width, height);
      this._pixiGraphics.alpha = opacity;
      this._pixiGraphics.zIndex = zIndex;
      this._pixiGraphics.endFill();
      state.values.app.stage.addChild(this._pixiGraphics);
    }
  }

  private getCoordinatesX(): number | null {
    if (typeof this._coordinates !== "undefined") {
      if (typeof this._coordinates.x === "number") {
        return this._coordinates.x;
      }
      try {
        return this._coordinates.x();
      } catch (error: unknown) {
        handleCaughtError(
          error,
          `Quadrilateral "${this._id}" coordinates x`,
          true,
        );
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
        handleCaughtError(
          error,
          `Quadrilateral "${this._id}" coordinates y`,
          true,
        );
      }
    }
    return null;
  }

  private getHeight(): number | null {
    if (typeof this._height === "number") {
      return this._height;
    }
    try {
      return this._height();
    } catch (error: unknown) {
      handleCaughtError(error, `Quadrilateral "${this._id}" height`, true);
      return null;
    }
  }

  private getOpacity(): number | null {
    if (typeof this._opacity === "number") {
      return this._opacity;
    }
    try {
      return this._opacity();
    } catch (error: unknown) {
      handleCaughtError(error, `Quadrilateral "${this._id}" opacity`, true);
      return null;
    }
  }

  private getWidth(): number | null {
    if (typeof this._width === "number") {
      return this._width;
    }
    try {
      return this._width();
    } catch (error: unknown) {
      handleCaughtError(error, `Quadrilateral "${this._id}" width`, true);
      return null;
    }
  }

  private passesCoordinatesCondition(): boolean {
    if (typeof this._coordinates === "undefined") {
      throw new Error(
        `Quadrilateral "${this._id}" attempted to check coordinates condition with no coordinates.`,
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
        `Quadrilateral "${this._id}" coordinates condition`,
        true,
      );
    }
    return false;
  }
}
export const createQuadrilateral = (
  options: CreateQuadrilateralOptions,
): string => new Quadrilateral(options).id;
/**
 * @param quadrilateralID - String QuadrilateralID of the Quadrilateral to remove
 */
export const removeQuadrilateral = (quadrilateralID: string): void => {
  getDefinable<Quadrilateral>(Quadrilateral, quadrilateralID).remove();
};
