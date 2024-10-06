import { AudioSource } from "./AudioSource";
import { Definable, getDefinable, getDefinables } from "definables";
import { getMainAdjustedVolume } from "../functions/getMainAdjustedVolume";
import { state } from "../state";
import { volumeTestHowl } from "../howls/volumeTestHowl";

export interface CreateVolumeChannelOptions {
  name: string;
}
export interface SetVolumeChannelVolumeOptions {
  id: string;
  volume: number;
}
export class VolumeChannel extends Definable {
  private readonly _volumeInputElement: HTMLInputElement =
    document.createElement("input");

  private readonly _volumeLabelElement: HTMLLabelElement =
    document.createElement("label");

  private readonly _volumeSliderElement: HTMLDivElement =
    document.createElement("div");

  public constructor(options: CreateVolumeChannelOptions) {
    super();
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
    this._volumeLabelElement.innerText = `${options.name} volume`;
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
      volumeTestHowl.volume(
        getMainAdjustedVolume(target.valueAsNumber) / 100,
      );
      volumeTestHowl.play();
    });
    this._volumeSliderElement.appendChild(this._volumeLabelElement);
    this._volumeSliderElement.appendChild(this._volumeInputElement);
    volumeSlidersElement.appendChild(this._volumeSliderElement);
  }

  public get volumeSliderElement(): HTMLInputElement {
    return this._volumeInputElement;
  }

  public setVolume(options: SetVolumeChannelVolumeOptions): void {
    if (options.volume < 0 || options.volume > 1) {
      throw new Error(
        `Volume must be between 0 and 1, but was ${options.volume}.`,
      );
    }
    this._volumeInputElement.value = String(options.volume * 100);
    for (const [, audioSource] of getDefinables(AudioSource)) {
      audioSource.updateVolume();
    }
  }
}
export const createVolumeChannel = (
  options: CreateVolumeChannelOptions,
): string => new VolumeChannel(options).id;
export const setVolumeChannelVolume = (
  options: SetVolumeChannelVolumeOptions,
): void => {
  getDefinable(VolumeChannel, options.id).setVolume(options);
};
