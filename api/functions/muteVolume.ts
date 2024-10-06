import { AudioSource } from "../classes/AudioSource";
import { getDefinables } from "definables";

export const muteVolume = (): void => {
  const toggleMuteInputElement: HTMLElement | null =
    document.getElementById("mute-toggle-input");
  if (toggleMuteInputElement instanceof HTMLInputElement === false) {
    throw new Error("No mute toggle input element was found in the DOM.");
  }
  toggleMuteInputElement.checked = true;
  getDefinables(AudioSource).forEach((audioSource: AudioSource): void => {
    audioSource.mute();
  });
};
