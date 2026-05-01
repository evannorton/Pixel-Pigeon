export const setScreenshotScale = (scale: number): void => {
  const scaleScreenshotInputElement: HTMLElement | null =
    document.getElementById("scale-screenshot-input");
  if (scaleScreenshotInputElement instanceof HTMLInputElement === false) {
    throw new Error(
      "An attempt was made to set screenshot scale with a scale screenshot input element that is not an input element.",
    );
  }
  scaleScreenshotInputElement.value = String(scale);
};
