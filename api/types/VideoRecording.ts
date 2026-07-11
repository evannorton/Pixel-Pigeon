export interface VideoRecording {
  readonly mediaRecorder: MediaRecorder;
  readonly mediaStream: MediaStream;
  readonly recordedChunks: Blob[];
}
