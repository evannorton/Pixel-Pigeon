import { AudioSource } from "../classes/AudioSource";
import { getDefinables } from "./getDefinables";

export interface SetMainVolumeOptions {
  volume: number;
}
export const setMainVolume = (options: SetMainVolumeOptions): void => {
  if (options.volume < 0 || options.volume > 1) {
    throw new Error(
      `Volume must be between 0 and 1, but was ${options.volume}.`,
    );
  }
  const mainVolumeSliderInputElement: HTMLElement | null =
    document.getElementById("main-volume-slider-input");
  if (mainVolumeSliderInputElement instanceof HTMLInputElement === false) {
    throw new Error("Could not find main volume slider input element.");
  }
  mainVolumeSliderInputElement.value = String(options.volume * 100);
  for (const [, audioSource] of getDefinables(AudioSource)) {
    audioSource.updateVolume();
  }
};
