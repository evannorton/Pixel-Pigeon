import { state } from "../../state";

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
  const canvas: HTMLCanvasElement = state.values.app.renderer.view;
  if (typeof canvas.captureStream === "undefined") {
    throw new Error(
      "An attempt was made to start video recording on a canvas that does not support captureStream.",
    );
  }
  if (typeof options.frameRate !== "undefined" && options.frameRate <= 0) {
    throw new Error(
      "An attempt was made to start video recording with a frameRate that is not greater than 0.",
    );
  }
  const mediaStream: MediaStream = canvas.captureStream(options.frameRate);
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
    },
  });
};
