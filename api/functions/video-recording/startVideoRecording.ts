import { state } from "../../state";

interface RenderScaledVideoRecordingFrameOptions {
  readonly renderAnimationFrameRequestID: {
    current: number;
  };
  readonly scaledCanvas: HTMLCanvasElement;
  readonly scaledCanvasContext: CanvasRenderingContext2D;
}
const renderScaledVideoRecordingFrame = (
  options: RenderScaledVideoRecordingFrameOptions,
): void => {
  if (state.values.app === null) {
    throw new Error(
      "An attempt was made to render a scaled video recording frame before app was created.",
    );
  }
  options.scaledCanvasContext.drawImage(
    state.values.app.renderer.view,
    0,
    0,
    options.scaledCanvas.width,
    options.scaledCanvas.height,
  );
  options.renderAnimationFrameRequestID.current = requestAnimationFrame(
    (): void => {
      renderScaledVideoRecordingFrame(options);
    },
  );
};

export interface StartVideoRecordingOptions {
  readonly frameRate?: number;
}
export const startVideoRecording = (
  options: StartVideoRecordingOptions,
): void => {
  if (state.values.app === null) {
    throw new Error(
      "An attempt was made to start video recording before app was created.",
    );
  }
  if (state.values.videoRecording !== null) {
    throw new Error(
      "An attempt was made to start video recording while a recording was already in progress.",
    );
  }
  if (typeof MediaRecorder === "undefined") {
    throw new Error(
      "An attempt was made to start video recording in an environment that does not support MediaRecorder.",
    );
  }
  if (typeof options.frameRate !== "undefined" && options.frameRate <= 0) {
    throw new Error(
      "An attempt was made to start video recording with a frameRate that is not greater than 0.",
    );
  }
  const scaleVideoRecordingInputElement: HTMLElement | null =
    document.getElementById("scale-video-recording-input");
  if (scaleVideoRecordingInputElement === null) {
    throw new Error(
      "An attempt was made to start video recording with no scale video recording input element.",
    );
  }
  if (scaleVideoRecordingInputElement instanceof HTMLInputElement === false) {
    throw new Error(
      "An attempt was made to start video recording with a scale video recording input element that is not an input element.",
    );
  }
  const scale: number = Number(scaleVideoRecordingInputElement.value);
  if (Number.isNaN(scale) === true || scale < 1) {
    throw new Error(
      "An attempt was made to start video recording with a scale that is not greater than or equal to 1.",
    );
  }
  const scaledCanvas: HTMLCanvasElement = document.createElement("canvas");
  scaledCanvas.width = state.values.app.renderer.view.width * scale;
  scaledCanvas.height = state.values.app.renderer.view.height * scale;
  const scaledCanvasContext: CanvasRenderingContext2D | null =
    scaledCanvas.getContext("2d");
  if (scaledCanvasContext === null) {
    throw new Error(
      "An attempt was made to start video recording but the scaled canvas 2d context could not be created.",
    );
  }
  scaledCanvasContext.imageSmoothingEnabled = false;
  const renderAnimationFrameRequestID: { current: number } = {
    current: 0,
  };
  const renderScaledVideoRecordingFrameOptions: RenderScaledVideoRecordingFrameOptions =
    {
      renderAnimationFrameRequestID,
      scaledCanvas,
      scaledCanvasContext,
    };
  renderAnimationFrameRequestID.current = requestAnimationFrame((): void => {
    renderScaledVideoRecordingFrame(renderScaledVideoRecordingFrameOptions);
  });
  const mediaStream: MediaStream = scaledCanvas.captureStream(
    options.frameRate,
  );
  const recordedChunks: Blob[] = [];
  const mediaRecorder: MediaRecorder = new MediaRecorder(mediaStream, {});
  mediaRecorder.ondataavailable = (blobEvent: BlobEvent): void => {
    if (blobEvent.data.size > 0) {
      recordedChunks.push(blobEvent.data);
    }
  };
  mediaRecorder.start();
  state.setValues({
    videoRecording: {
      mediaRecorder,
      mediaStream,
      recordedChunks,
      renderAnimationFrameRequestID,
    },
  });
};
