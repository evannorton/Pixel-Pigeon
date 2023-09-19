import { Definable } from "./Definable";
import { Howl } from "howler";
import { getDefinable } from "../functions/getDefinable";
import { state } from "../state";

interface AudioSourceOptions {
  readonly audioPath: string;
}

export class AudioSource extends Definable {
  private readonly _howl: Howl;
  private readonly _options: AudioSourceOptions;
  private _loopPoint: number | null = null;

  public constructor(options: AudioSourceOptions) {
    super(options.audioPath);
    this._options = options;
    this._howl = new Howl({
      autoplay: false,
      loop: false,
      preload: true,
      src: [`audio/${this._options.audioPath}.mp3`],
      volume: 0.5,
    });
    this._howl.on("end", (): void => {
      this.onHowlEnd();
    });
    this._howl.on("load", (): void => {
      this.onHowlLoad();
    });
  }

  public isPlaying(): boolean {
    return this._howl.playing();
  }

  public pause(): void {
    this._howl.pause();
  }

  public play(playAudioOptions?: PlayAudioSourceOptions): void {
    this._howl.play();
    this._loopPoint = playAudioOptions?.loopPoint ?? null;
  }

  public stop(): void {
    this._howl.stop();
  }

  private onHowlEnd(): void {
    if (this._loopPoint !== null) {
      this.stop();
      this._howl.seek(this._loopPoint / 1000);
      this._howl.play();
    }
  }

  private onHowlLoad(): void {
    state.setValues({
      loadedAssets: state.values.loadedAssets + 1,
    });
  }
}
export interface PlayAudioSourceOptions {
  readonly loopPoint?: number;
}
/**
 * Play the provided audio within the game
 * @param audioSourceID - Path to the audio that will be played. **STARTS IN THE `audio` FOLDER**
 *
 * @example
 * ```ts
 * playAudioSource("music"); // Plays {PROJECTFILE}/audio/music.mp3
 * ```
 */
export const playAudioSource = (
  audioSourceID: string,
  playAudioOptions?: PlayAudioSourceOptions,
): void => {
  getDefinable<AudioSource>(AudioSource, audioSourceID).play(playAudioOptions);
};
/**
 * Stop the provided audio within the game
 * @param audioSourceID - Path to the audio that will be stopped. **STARTS IN THE `audio` FOLDER**
 * @example
 * ```ts
 * stopAudioSource("music"); // Stops {PROJECTFILE}/audio/music.mp3
 * ```
 */
export const stopAudioSource = (audioSourceID: string): void => {
  getDefinable<AudioSource>(AudioSource, audioSourceID).stop();
};
