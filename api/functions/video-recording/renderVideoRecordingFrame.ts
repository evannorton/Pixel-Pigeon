import { state } from "../../state";

export const renderVideoRecordingFrame = (): void => {
  if (state.values.app === null) {
    throw new Error(
      "An attempt was made to render a video recording frame before app was created.",
    );
  }
  if (state.values.videoRecording === null) {
    throw new Error(
      "An attempt was made to render a video recording frame while no recording was in progress.",
    );
  }
  state.values.videoRecording.scaledCanvasContext.drawImage(
    state.values.app.renderer.view,
    0,
    0,
    state.values.videoRecording.scaledCanvas.width,
    state.values.videoRecording.scaledCanvas.height,
  );
};
