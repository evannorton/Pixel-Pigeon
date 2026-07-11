import { state } from "../../state";

export const stopVideoRecording = (): void => {
  if (state.values.config === null) {
    throw new Error(
      "An attempt was made to stop video recording before config was loaded.",
    );
  }
  if (state.values.videoRecording === null) {
    throw new Error(
      "An attempt was made to stop video recording while no recording was in progress.",
    );
  }
  const mediaRecorder: MediaRecorder =
    state.values.videoRecording.mediaRecorder;
  const mediaStream: MediaStream = state.values.videoRecording.mediaStream;
  const recordedChunks: Blob[] = state.values.videoRecording.recordedChunks;
  const recordingName: string = state.values.config.name;
  mediaRecorder.onstop = (): void => {
    const blob: Blob = new Blob(recordedChunks, {
      type: mediaRecorder.mimeType,
    });
    const objectURL: string = URL.createObjectURL(blob);
    const anchor: HTMLAnchorElement = document.createElement("a");
    const fileExtension: string =
      mediaRecorder.mimeType.includes("mp4") === true ? "mp4" : "webm";
    anchor.download = `${recordingName} recording.${fileExtension}`;
    anchor.href = objectURL;
    anchor.click();
    URL.revokeObjectURL(objectURL);
    for (const mediaStreamTrack of mediaStream.getTracks()) {
      mediaStreamTrack.stop();
    }
  };
  mediaRecorder.stop();
  state.setValues({
    videoRecording: null,
  });
};
