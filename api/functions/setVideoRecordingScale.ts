export const setVideoRecordingScale = (scale: number): void => {
  const scaleVideoRecordingInputElement: HTMLElement | null =
    document.getElementById("scale-video-recording-input");
  if (scaleVideoRecordingInputElement instanceof HTMLInputElement === false) {
    throw new Error(
      "An attempt was made to set video recording scale with a scale video recording input element that is not an input element.",
    );
  }
  scaleVideoRecordingInputElement.value = String(scale);
};
