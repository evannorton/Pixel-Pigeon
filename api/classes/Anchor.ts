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
export class Anchor extends Definable {
  private readonly _anchorElement: HTMLAnchorElement =
    document.createElement("a");

  private readonly _options: CreateAnchorOptions;

  public constructor(options: CreateAnchorOptions) {
    super(getToken());
    this._options = options;
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
      const xPercent: number =
        this._options.coordinates.x / state.values.config.width;
      const yPercent: number =
        this._options.coordinates.y / state.values.config.height;
      const widthPercent: number =
        this._options.width / state.values.config.width;
      const heightPercent: number =
        this._options.height / state.values.config.height;
      this._anchorElement.style.left = `${xPercent * 100}%`;
      this._anchorElement.style.top = `${yPercent * 100}%`;
      this._anchorElement.style.width = `${widthPercent * 100}%`;
      this._anchorElement.style.height = `${heightPercent * 100}%`;
      this._anchorElement.href = this._options.url;
    } else {
      this._anchorElement.style.display = "none";
    }
  }

  private passesCoordinatesCondition(): boolean {
    if (typeof this._options.coordinates === "undefined") {
      throw new Error(
        `Anchor "${this._id}" attempted to check coordinates condition with no coordinates.`,
      );
    }
    if (typeof this._options.coordinates.condition === "undefined") {
      return true;
    }
    try {
      return this._options.coordinates.condition();
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
