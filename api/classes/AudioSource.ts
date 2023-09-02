import { Definable } from "./Definable";
import { Howl } from "howler";
import { getDefinable } from "pigeon-mode-game-framework/api/functions/getDefinable";
import { state } from "../state";

interface AudioSourceOptions {
  readonly audioPath: string;
}

export class AudioSource extends Definable {
  private readonly _howl: Howl;
  private readonly _options: AudioSourceOptions;

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

  public play(): void {
    this._howl.play();
  }

  public stop(): void {
    this._howl.stop();
  }

  private onHowlLoad(): void {
    state.setValues({
      loadedAssets: state.values.loadedAssets + 1,
    });
  }
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
export const playAudioSource = (audioSourceID: string): void => {
  getDefinable<AudioSource>(AudioSource, audioSourceID).play();
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
