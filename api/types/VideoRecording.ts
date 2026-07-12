export interface VideoRecording {
  readonly audioDestination: MediaStreamAudioDestinationNode;
  readonly mediaRecorder: MediaRecorder;
  readonly mediaStream: MediaStream;
  readonly recordedChunks: Blob[];
  readonly scaledCanvas: HTMLCanvasElement;
  readonly scaledCanvasContext: CanvasRenderingContext2D;
}
