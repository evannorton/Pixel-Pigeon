import { Definable } from "./Definable";
import { getDefinable } from "../functions/getDefinable";
import { getToken } from "../functions/getToken";
import { handleCaughtError } from "../functions/handleCaughtError";
import { state } from "../state";

export interface CreateAnchorOptions {
  /**
   * Coordinates that can be used to precisely define where the Anchor should be on the screen
   */
  coordinates: {
    /**
     * Callback that decides whether or not coordinates should be used
     */
    condition?: () => boolean;
    /**
     * The X value on the screen where the Anchor is positioned
     */
    x: number;
    /**
     * The Y value on the screen where the Anchor is positioned
     */
    y: number;
  };
  height: number;
  width: number;
  url: string;
}
interface AnchorCoordinates {
  readonly condition: (() => boolean) | null;
  readonly x: number;
  readonly y: number;
}

export class Anchor extends Definable {
  private readonly _anchorElement: HTMLAnchorElement =
    document.createElement("a");

  private readonly _coordinates: AnchorCoordinates;
  private readonly _height: number;
  private readonly _url: string;
  private readonly _width: number;

  public constructor(options: CreateAnchorOptions) {
    super(getToken());
    this._coordinates = {
      condition: options.coordinates.condition ?? null,
      x: options.coordinates.x,
      y: options.coordinates.y,
    };
    this._height = options.height;
    this._url = options.url;
    this._width = options.width;
    const anchorsElement: HTMLElement | null =
      document.getElementById("anchors");
    if (anchorsElement === null) {
      throw new Error("Attempted to create Anchor with no anchors element.");
    }
    anchorsElement.appendChild(this._anchorElement);
    this._anchorElement.className = "anchor";
    this._anchorElement.target = "_blank";
  }

  public update(): void {
    if (state.values.config === null) {
      throw new Error(
        `Anchor "${this._id}" attempted to update before config was loaded.`,
      );
    }
    if (this.passesCoordinatesCondition()) {
      this._anchorElement.style.display = "block";
      const xPercent: number = this._coordinates.x / state.values.config.width;
      const yPercent: number = this._coordinates.y / state.values.config.height;
      const widthPercent: number = this._width / state.values.config.width;
      const heightPercent: number = this._height / state.values.config.height;
      this._anchorElement.style.left = `${xPercent * 100}%`;
      this._anchorElement.style.top = `${yPercent * 100}%`;
      this._anchorElement.style.width = `${widthPercent * 100}%`;
      this._anchorElement.style.height = `${heightPercent * 100}%`;
      this._anchorElement.href = this._url;
    } else {
      this._anchorElement.style.display = "none";
    }
  }

  private passesCoordinatesCondition(): boolean {
    if (this._coordinates.condition === null) {
      return true;
    }
    try {
      return this._coordinates.condition();
    } catch (error: unknown) {
      handleCaughtError(error, `Anchor "${this._id}" coordinates condition`);
    }
    return false;
  }
}
export const createAnchor = (options: CreateAnchorOptions): string =>
  new Anchor(options).id;
/**
 * @param labelID - String AnchorID of the sprite to remove
 */
export const removeAnchor = (labelID: string): void => {
  getDefinable<Anchor>(Anchor, labelID).remove();
};
