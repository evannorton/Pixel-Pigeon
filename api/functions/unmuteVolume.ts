import { AudioSource } from "../classes/AudioSource";
import { getDefinables } from "definables";

export const unmuteVolume = (): void => {
  const toggleMuteInputElement: HTMLElement | null =
    document.getElementById("mute-toggle-input");
  if (toggleMuteInputElement instanceof HTMLInputElement === false) {
    throw new Error("No mute toggle input element was found in the DOM.");
  }
  toggleMuteInputElement.checked = false;
  getDefinables(AudioSource).forEach((audioSource: AudioSource): void => {
    audioSource.unmute();
  });
};
