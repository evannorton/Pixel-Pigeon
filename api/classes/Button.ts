import {
  CameraCoordinates,
  getCameraCoordinates,
} from "../functions/getCameraCoordinates";
import { Definable, getDefinable, getDefinables } from "definables";
import { Entity } from "./Entity";
import { EntityButton, EntityPosition } from "../types/World";
import { NineSlice } from "./NineSlice";
import { Scriptable } from "../types/Scriptable";
import { handleCaughtError } from "../functions/handleCaughtError";
import { state } from "../state";

export interface CreateButtonOptionsCoordinates {
  /**
   * Callback that decides whether or not coordinates should be used
   */
  condition?: () => boolean;
  /**
   * The X value on the screen where the Button is positioned
   */
  x: Scriptable<number>;
  /**
   * The Y value on the screen where the Button is positioned
   */
  y: Scriptable<number>;
}
export interface CreateButtonOptions {
  allowsMousedownThrough?: boolean;
  /**
   * Coordinates that can be used to precisely define where the Button should be on the screen
   */
  coordinates?: CreateButtonOptionsCoordinates;
  height: number;
  onClick?: () => void;
  onMouseDown?: () => void;
  onRelease?: () => void;
  width: number;
}
interface ButtonCoordinates {
  readonly condition?: () => boolean;
  readonly x: Scriptable<number>;
  readonly y: Scriptable<number>;
}
interface ButtonEntity {
  entityID: string;
  entityButton: EntityButton;
}

export class Button extends Definable {
  private readonly _allowsMousedownThrough: boolean;
  private readonly _coordinates?: ButtonCoordinates;
  private _didClickOccur: boolean = false;
  private _didMousedownOccur: boolean = false;
  private _didReleaseOccur: boolean = false;
  private _entity: ButtonEntity | null = null;
  private readonly _height: number;
  private _isHeld: boolean = false;
  private readonly _onClick?: () => void;
  private readonly _onMouseDown?: () => void;
  private readonly _onRelease?: () => void;
  private readonly _width: number;

  public constructor(options: CreateButtonOptions) {
    super();
    this._allowsMousedownThrough = options.allowsMousedownThrough ?? false;
    if (typeof options.coordinates !== "undefined") {
      this._coordinates = {
        condition: options.coordinates.condition,
        x: options.coordinates.x,
        y: options.coordinates.y,
      };
    }
    this._height = options.height;
    this._onClick = options.onClick;
    this._onMouseDown = options.onMouseDown;
    this._onRelease = options.onRelease;
    this._width = options.width;
  }

  public get entity(): ButtonEntity {
    if (this._entity !== null) {
      return this._entity;
    }
    throw new Error(this.getAccessorErrorMessage("entity"));
  }

  public set entity(entity: ButtonEntity | null) {
    this._entity = entity;
  }

  public handleHeld(): void {
    if (this.isHovered() && state.values.mousedownConsumed === false) {
      this._isHeld = true;
      this._didMousedownOccur = true;
      if (this._allowsMousedownThrough === false) {
        state.setValues({ mousedownConsumed: true });
      }
    }
  }

  public handleUnheld(): void {
    if (this._isHeld) {
      if (this.isHovered()) {
        this._didClickOccur = true;
      }
      this._didReleaseOccur = true;
      this._isHeld = false;
    }
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

  public isHovered(): boolean {
    if (
      this._entity !== null &&
      Array.from(getDefinables(NineSlice)).some(
        ([, nineSlice]: [string, NineSlice]): boolean => nineSlice.isHovered(),
      )
    ) {
      return false;
    }
    if (state.values.mouseCoords !== null) {
      let x: number | undefined;
      let y: number | undefined;
      if (typeof this._coordinates !== "undefined") {
        if (this.passesCoordinatesCondition() === false) {
          return false;
        }
        const coordinatesX: number | null = this.getCoordinatesX();
        const coordinatesY: number | null = this.getCoordinatesY();
        if (coordinatesX === null || coordinatesY === null) {
          return false;
        }
        x = coordinatesX;
        y = coordinatesY;
      }
      if (this._entity !== null) {
        const entityPosition: EntityPosition = getDefinable(
          Entity,
          this._entity.entityID,
        ).position;
        const cameraCoordinates: CameraCoordinates = getCameraCoordinates();
        x = Math.floor(entityPosition.x) - cameraCoordinates.x;
        y = Math.floor(entityPosition.y) - cameraCoordinates.y;
      }
      if (typeof x === "undefined" || typeof y === "undefined") {
        throw new Error(
          `Button "${this._id}" attempted to check hover with no coordinates.`,
        );
      }
      if (
        state.values.mouseCoords.x >= x &&
        state.values.mouseCoords.x < x + this._width &&
        state.values.mouseCoords.y >= y &&
        state.values.mouseCoords.y < y + this._height
      ) {
        return true;
      }
    }
    return false;
  }

  public update(): void {
    if (this._didClickOccur) {
      this._didClickOccur = false;
      try {
        this._onClick?.();
        this._entity?.entityButton.onClick?.();
      } catch (error: unknown) {
        handleCaughtError(error, `Button "${this._id}" onClick`, true);
      }
    }
    if (this._didMousedownOccur) {
      this._didMousedownOccur = false;
      try {
        this._onMouseDown?.();
      } catch (error: unknown) {
        handleCaughtError(error, `Button "${this._id}" onMouseDown`, true);
      }
    }
    if (this._didReleaseOccur) {
      this._didReleaseOccur = false;
      try {
        this._onRelease?.();
      } catch (error: unknown) {
        handleCaughtError(error, `Button "${this._id}" onRelease`, true);
      }
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
        handleCaughtError(error, `Button "${this._id}" coordinates x`, true);
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
        handleCaughtError(error, `Button "${this._id}" coordinates y`, true);
      }
    }
    return null;
  }

  private passesCoordinatesCondition(): boolean {
    if (typeof this._coordinates === "undefined") {
      throw new Error(
        `Button "${this._id}" attempted to check coordinates condition with no coordinates.`,
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
        `Button "${this._id}" coordinates condition`,
        true,
      );
    }
    return false;
  }
}
export const createButton = (options: CreateButtonOptions): string =>
  new Button(options).id;
/**
 * @param labelID - String ButtonID of the Button to remove
 */
export const removeButton = (labelID: string): void => {
  getDefinable<Button>(Button, labelID).remove();
};
