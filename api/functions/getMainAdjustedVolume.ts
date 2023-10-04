export const getMainAdjustedVolume = (volume: number): number => {
  const mainVolumeSliderInputElement: HTMLElement | null =
    document.getElementById("main-volume-slider-input");
  if (mainVolumeSliderInputElement === null) {
    throw new Error(
      "An attempt was made to get main adjusted volume with no main volume slider element in the DOM.",
    );
  }
  if (mainVolumeSliderInputElement instanceof HTMLInputElement) {
    return volume * (mainVolumeSliderInputElement.valueAsNumber / 100);
  }
  throw new Error(
    "An attempt was made to get main adjusted volume with a main volume slider element that is not an input element.",
  );
};
