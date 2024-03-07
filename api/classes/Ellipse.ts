import {
  CameraCoordinates,
  getCameraCoordinates,
} from "../functions/getCameraCoordinates";
import { Definable } from "./Definable";
import { Entity, EntityEllipse } from "../types/World";
import { Graphics } from "pixi.js";
import { Scriptable } from "../types/Scriptable";
import { getDefinable } from "../functions/getDefinable";
import { getToken } from "../functions/getToken";
import { handleCaughtError } from "../functions/handleCaughtError";
import { state } from "../state";

export interface CreateEllipseOptionsCoordinates {
  /**
   * Callback that decides whether or not coordinates should be used
   */
  condition?: () => boolean;
  /**
   * The X value on the screen where the Ellipse is displayed
   */
  x: Scriptable<number>;
  /**
   * The Y value on the screen where the Ellipse is displayed
   */
  y: Scriptable<number>;
}
export interface CreateEllipseOptions {
  color: string;
  /**
   * Coordinates that can be used to precisely define where the Ellipse should be on the screen
   */
  coordinates?: CreateEllipseOptionsCoordinates;
  height: Scriptable<number>;
  opacity?: Scriptable<number>;
  width: Scriptable<number>;
}
interface EllipseCoordinates {
  readonly condition: (() => boolean) | null;
  readonly x: Scriptable<number>;
  readonly y: Scriptable<number>;
}

export class Ellipse extends Definable {
  private readonly _color: string;
  private readonly _coordinates: EllipseCoordinates | null;
  private readonly _height: Scriptable<number>;
  private readonly _opacity: Scriptable<number>;
  private readonly _pixiGraphics: Graphics = new Graphics();

  private readonly _width: Scriptable<number>;
  public constructor(options: CreateEllipseOptions) {
    super(getToken());
    this._color = options.color;
    this._coordinates = options.coordinates
      ? {
          condition: options.coordinates.condition ?? null,
          x: options.coordinates.x,
          y: options.coordinates.y,
        }
      : null;
    this._height = options.height;
    this._opacity = options.opacity ?? 1;
    this._width = options.width;
  }

  public clear(): void {
    this._pixiGraphics.clear();
  }

  public drawAtCoordinates(): void {
    if (state.values.config === null) {
      throw new Error(
        `Ellipse "${this._id}" attempted to draw at coordinates before config was loaded.`,
      );
    }
    if (this._coordinates !== null && this.passesCoordinatesCondition()) {
      const x: number | null = this.getCoordinatesX();
      const y: number | null = this.getCoordinatesY();
      if (x !== null && y !== null) {
        this.drawAtPosition(x, y, 100);
      }
    }
  }

  public drawAtEntity(
    entity: Entity,
    entityEllipse: EntityEllipse,
    layerIndex: number,
  ): void {
    const zIndex: number = layerIndex + 1 / (1 + Math.exp(-entity.zIndex));
    const cameraCoordinates: CameraCoordinates = getCameraCoordinates();
    const x: number =
      Math.floor(entity.position.x) +
      (entityEllipse.x ?? 0) -
      cameraCoordinates.x;
    const y: number =
      Math.floor(entity.position.y) +
      (entityEllipse.y ?? 0) -
      cameraCoordinates.y;
    this.drawAtPosition(x, y, zIndex);
  }

  public isAttached(): boolean {
    if (state.values.world === null) {
      throw new Error(
        `Ellipse "${this._id}" attempted to check if it was attached before world was loaded.`,
      );
    }
    if (this._coordinates !== null) {
      return true;
    }
    for (const level of state.values.world.levels.values()) {
      for (const layer of level.layers) {
        for (const entity of layer.entities.values()) {
          if (
            entity.ellipses.some(
              (ellipse: EntityEllipse): boolean =>
                ellipse.ellipseID === this._id,
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
    this._pixiGraphics.destroy();
  }

  private drawAtPosition(x: number, y: number, zIndex: number): void {
    if (state.values.app === null) {
      throw new Error(
        `Ellipse "${this._id}" attempted to draw before app was created.`,
      );
    }
    const opacity: number | null = this.getOpacity();
    const width: number | null = this.getWidth();
    const height: number | null = this.getHeight();
    if (opacity !== null && width !== null && height !== null) {
      this._pixiGraphics.beginFill(Number(`0x${this._color.substring(1)}`));
      this._pixiGraphics.lineStyle(0, Number(`0x${this._color.substring(1)}`));
      const pixels: Map<
        number,
        {
          endX: number;
          startX: number;
        }
      > = new Map();
      const xRadius: number = width / 2;
      const yRadius: number = height / 2;
      for (let i: number = -xRadius + 1; i < xRadius; i++) {
        for (let j: number = -yRadius + 1; j < yRadius; j++) {
          if (Math.pow(i / xRadius, 2) + Math.pow(j / yRadius, 2) <= 1) {
            const pixelX: number = Math.floor(x + xRadius + i);
            const pixelY: number = Math.floor(y + yRadius + j);
            const bounds:
              | {
                  startX: number;
                  endX: number;
                }
              | undefined = pixels.get(pixelY);
            const fixedBounds: {
              endX: number;
              startX: number;
            } =
              typeof bounds !== "undefined"
                ? bounds
                : {
                    endX: pixelX,
                    startX: pixelX,
                  };
            if (pixelX < fixedBounds.startX) {
              fixedBounds.startX = pixelX;
            }
            if (pixelX > fixedBounds.endX) {
              fixedBounds.endX = pixelX;
            }
            pixels.set(pixelY, fixedBounds);
          }
        }
      }
      pixels.forEach(
        (
          bounds: {
            endX: number;
            startX: number;
          },
          key: number,
        ): void => {
          this._pixiGraphics.drawRect(
            bounds.startX,
            key,
            bounds.endX - bounds.startX,
            1,
          );
        },
      );
      this._pixiGraphics.alpha = opacity;
      this._pixiGraphics.zIndex = zIndex;
      this._pixiGraphics.endFill();
      state.values.app.stage.addChild(this._pixiGraphics);
    }
  }

  private getCoordinatesX(): number | null {
    if (this._coordinates !== null) {
      if (typeof this._coordinates.x === "number") {
        return this._coordinates.x;
      }
      try {
        return this._coordinates.x();
      } catch (error: unknown) {
        handleCaughtError(error, `Ellipse "${this._id}" coordinates x`);
      }
    }
    return null;
  }

  private getCoordinatesY(): number | null {
    if (this._coordinates !== null) {
      if (typeof this._coordinates.y === "number") {
        return this._coordinates.y;
      }
      try {
        return this._coordinates.y();
      } catch (error: unknown) {
        handleCaughtError(error, `Ellipse "${this._id}" coordinates y`);
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
      handleCaughtError(error, `Ellipse "${this._id}" height`);
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
      handleCaughtError(error, `Ellipse "${this._id}" opacity`);
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
      handleCaughtError(error, `Ellipse "${this._id}" width`);
      return null;
    }
  }

  private passesCoordinatesCondition(): boolean {
    if (this._coordinates === null) {
      throw new Error(
        `Ellipse "${this._id}" attempted to check coordinates condition with no coordinates.`,
      );
    }
    if (this._coordinates.condition === null) {
      return true;
    }
    try {
      return this._coordinates.condition();
    } catch (error: unknown) {
      handleCaughtError(error, `Ellipse "${this._id}" coordinates condition`);
    }
    return false;
  }
}
export const createEllipse = (options: CreateEllipseOptions): string =>
  new Ellipse(options).id;
/**
 * @param ellipseID - String EllipseID of the ellipse to remove
 */
export const removeEllipse = (ellipseID: string): void => {
  getDefinable<Ellipse>(Ellipse, ellipseID).remove();
};
