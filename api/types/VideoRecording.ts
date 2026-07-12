export interface VideoRecording {
  readonly mediaRecorder: MediaRecorder;
  readonly mediaStream: MediaStream;
  readonly recordedChunks: Blob[];
  readonly scaledCanvas: HTMLCanvasElement;
  readonly scaledCanvasContext: CanvasRenderingContext2D;
}
