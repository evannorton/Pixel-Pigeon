import { Definable } from "./Definable";
import { getDefinable } from "../functions/getDefinable";
import { getToken } from "../functions/getToken";
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
  x: number;
  /**
   * The Y value on the screen where the Button is positioned
   */
  y: number;
}
export interface CreateButtonOptions {
  /**
   * Coordinates that can be used to precisely define where the Button should be on the screen
   */
  coordinates: CreateButtonOptionsCoordinates;
  height: number;
  onClick?: () => void;
  onMouseDown?: () => void;
  onRelease?: () => void;
  width: number;
}
interface ButtonCoordinates {
  readonly condition: (() => boolean) | null;
  readonly x: number;
  readonly y: number;
}

export class Button extends Definable {
  private readonly _coordinates: ButtonCoordinates;
  private _didClickOccur: boolean = false;
  private _didMouseDownOccur: boolean = false;
  private _didReleaseOccur: boolean = false;
  private readonly _element: HTMLDivElement = document.createElement("div");
  private readonly _height: number;
  private readonly _onClick?: () => void;
  private readonly _onMouseDown?: () => void;
  private readonly _onRelease?: () => void;
  private readonly _width: number;

  public constructor(options: CreateButtonOptions) {
    super(getToken());
    this._coordinates = {
      condition: options.coordinates.condition ?? null,
      x: options.coordinates.x,
      y: options.coordinates.y,
    };
    this._height = options.height;
    this._onClick = options.onClick;
    this._onMouseDown = options.onMouseDown;
    this._onRelease = options.onRelease;
    this._width = options.width;
    const buttonsElement: HTMLElement | null =
      document.getElementById("buttons");
    if (buttonsElement === null) {
      throw new Error(
        "An attempt was made to create Button with no buttons element.",
      );
    }
    buttonsElement.appendChild(this._element);
    this._element.className = "button";
    this._element.addEventListener("click", (): void => {
      this._didClickOccur = true;
    });
    this._element.addEventListener("mousedown", (): void => {
      this._didMouseDownOccur = true;
      const onMouseUp = (): void => {
        this._didReleaseOccur = true;
        removeEventListener("mouseup", onMouseUp);
      };
      addEventListener("mouseup", onMouseUp);
    });
  }

  public update(): void {
    if (state.values.config === null) {
      throw new Error(
        `Button "${this._id}" attempted to update before config was loaded.`,
      );
    }
    if (this.passesCoordinatesCondition()) {
      this._element.style.display = "block";
      const xPercent: number = this._coordinates.x / state.values.config.width;
      const yPercent: number = this._coordinates.y / state.values.config.height;
      const widthPercent: number = this._width / state.values.config.width;
      const heightPercent: number = this._height / state.values.config.height;
      this._element.style.left = `${xPercent * 100}%`;
      this._element.style.top = `${yPercent * 100}%`;
      this._element.style.width = `${widthPercent * 100}%`;
      this._element.style.height = `${heightPercent * 100}%`;
    } else {
      this._element.style.display = "none";
    }
    if (this._didClickOccur) {
      this._didClickOccur = false;
      try {
        this._onClick?.();
      } catch (error: unknown) {
        handleCaughtError(error, `Button "${this._id}" onClick`);
      }
    }
    if (this._didMouseDownOccur) {
      this._didMouseDownOccur = false;
      try {
        this._onMouseDown?.();
      } catch (error: unknown) {
        handleCaughtError(error, `Button "${this._id}" onMouseDown`);
      }
    }
    if (this._didReleaseOccur) {
      this._didReleaseOccur = false;
      try {
        this._onRelease?.();
      } catch (error: unknown) {
        handleCaughtError(error, `Button "${this._id}" onRelease`);
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
      handleCaughtError(error, `Button "${this._id}" coordinates condition`);
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
