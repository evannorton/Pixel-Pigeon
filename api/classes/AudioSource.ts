import { Definable } from "./Definable";
import { Howl } from "howler";
import { VolumeChannel } from "./VolumeChannel";
import { getDefinable } from "../functions/getDefinable";
import { getMainAdjustedVolume } from "../functions/getMainAdjustedVolume";
import { state } from "../state";

interface AudioSourceOptions {
  readonly audioPath: string;
}

export class AudioSource extends Definable {
  private readonly _howl: Howl;
  private readonly _options: AudioSourceOptions;
  private _playOptions: PlayAudioSourceOptions | null = null;

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

  public isPlayingInVolumeChannel(volumeChannelID: string): boolean {
    return (
      this._playOptions !== null &&
      this._playOptions.volumeChannelID === volumeChannelID
    );
  }

  public mute(): void {
    this._howl.mute(true);
  }

  public pause(): void {
    this._howl.pause();
  }

  public play(playAudioOptions: PlayAudioSourceOptions): void {
    this._howl.play();
    this._playOptions = playAudioOptions;
  }

  public resume(): void {
    this._howl.play();
  }

  public stop(): void {
    this._howl.stop();
  }

  public unmute(): void {
    this._howl.mute(false);
  }

  public updateVolume(): void {
    if (this._playOptions === null) {
      throw new Error(
        `An attempt was made to update the volume of AudioSource "${this._id}" with no play options.`,
      );
    }
    const volumeChannel: VolumeChannel = getDefinable<VolumeChannel>(
      VolumeChannel,
      this._playOptions.volumeChannelID,
    );
    this._howl.volume(
      getMainAdjustedVolume(volumeChannel.volumeSliderElement.valueAsNumber) /
        100,
    );
  }

  private onHowlEnd(): void {
    if (this._playOptions === null) {
      throw new Error(
        `OnHowlEnd was triggered for AudioSource "${this._id}" with no play options.`,
      );
    }
    if (typeof this._playOptions.loopPoint !== "undefined") {
      this.stop();
      this._howl.seek(this._playOptions.loopPoint / 1000);
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
  loopPoint?: number;
  volumeChannelID: string;
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
  playAudioOptions: PlayAudioSourceOptions,
): void => {
  if (state.values.config === null) {
    throw new Error(
      `An attempt was made to play AudioSource "${audioSourceID}" before config was loaded.`,
    );
  }
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
