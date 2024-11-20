import { Definable, getDefinable } from "definables";
import { Howl } from "howler";
import { VolumeChannel } from "./VolumeChannel";
import { attemptGetWorld } from "../functions/attemptGetWorld";
import { defaultVolume } from "../constants/defaultVolume";
import { getMainAdjustedVolume } from "../functions/getMainAdjustedVolume";
import { state } from "../state";

interface AudioSourceOptions {
  readonly audioPath: string;
}
interface Play {
  loopPoint?: number;
  volumeChannelID: string;
}

export class AudioSource extends Definable {
  private readonly _audioPath: string;
  private readonly _howl: Howl;
  private _play: Play | null = null;

  public constructor(options: AudioSourceOptions) {
    super(options.audioPath);
    this._audioPath = options.audioPath;
    this._howl = new Howl({
      autoplay: false,
      loop: false,
      preload: true,
      src: [`audio/${encodeURIComponent(this._audioPath)}.mp3`],
      volume: defaultVolume,
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
      this._play !== null && this._play.volumeChannelID === volumeChannelID
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
    this._play = {
      loopPoint: playAudioOptions.loopPoint,
      volumeChannelID: playAudioOptions.volumeChannelID,
    };
    this.updateVolume();
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
    if (this._play !== null) {
      const volumeChannel: VolumeChannel = getDefinable<VolumeChannel>(
        VolumeChannel,
        this._play.volumeChannelID,
      );
      this._howl.volume(
        getMainAdjustedVolume(volumeChannel.volumeSliderElement.valueAsNumber) /
          100,
      );
    }
  }

  private onHowlEnd(): void {
    if (this._play === null) {
      throw new Error(
        `OnHowlEnd was triggered for AudioSource "${this._id}" with no play options.`,
      );
    }
    if (typeof this._play.loopPoint !== "undefined") {
      this.stop();
      this._howl.seek(this._play.loopPoint / 1000);
      this._howl.play();
    }
  }

  private onHowlLoad(): void {
    state.setValues({
      loadedAssets: state.values.loadedAssets + 1,
    });
    attemptGetWorld();
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
