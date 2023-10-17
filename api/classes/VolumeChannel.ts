import { AudioSource } from "./AudioSource";
import { Definable } from "./Definable";
import { getDefinables } from "../functions/getDefinables";
import { getMainAdjustedVolume } from "../functions/getMainAdjustedVolume";
import { getToken } from "../functions/getToken";
import { state } from "../state";

export interface CreateVolumeChannelOptions {
  readonly name: string;
}
export class VolumeChannel extends Definable {
  private readonly _volumeInputElement: HTMLInputElement =
    document.createElement("input");

  private readonly _volumeLabelElement: HTMLLabelElement =
    document.createElement("label");

  private readonly _volumeSliderElement: HTMLDivElement =
    document.createElement("div");

  public constructor(options: CreateVolumeChannelOptions) {
    super(getToken());
    const volumeSlidersElement: HTMLElement | null =
      document.getElementById("volume-sliders");
    if (volumeSlidersElement === null) {
      throw new Error(
        `An attempt was made to construct VolumeChannel "${this._id}" with no volume sliders element in the DOM.`,
      );
    }
    this._volumeSliderElement.classList.add("volume-slider");
    const inputElementID: string = `volume-slider-input-${this._id}`;
    this._volumeLabelElement.setAttribute("for", inputElementID);
    this._volumeLabelElement.innerText = `${options.name} Volume`;
    this._volumeInputElement.id = inputElementID;
    this._volumeInputElement.name = inputElementID;
    this._volumeInputElement.type = "range";
    this._volumeInputElement.min = "0";
    this._volumeInputElement.max = "100";
    this._volumeInputElement.value = "50";
    this._volumeInputElement.addEventListener("input", (): void => {
      for (const [, audioSource] of getDefinables(AudioSource)) {
        if (audioSource.isPlayingInVolumeChannel(this._id)) {
          audioSource.updateVolume();
        }
      }
    });
    this._volumeInputElement.addEventListener("mouseup", (e: Event): void => {
      const target: HTMLInputElement = e.target as HTMLInputElement;
      state.values.volumeTestHowl.volume(
        getMainAdjustedVolume(target.valueAsNumber) / 100,
      );
      state.values.volumeTestHowl.play();
    });
    this._volumeSliderElement.appendChild(this._volumeLabelElement);
    this._volumeSliderElement.appendChild(this._volumeInputElement);
    volumeSlidersElement.appendChild(this._volumeSliderElement);
  }

  public get volumeSliderElement(): HTMLInputElement {
    return this._volumeInputElement;
  }
}
export const createVolumeChannel = (
  options: CreateVolumeChannelOptions,
): string => new VolumeChannel(options).id;
