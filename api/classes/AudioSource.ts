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
interface FadeInAction {
  readonly duration: number;
  readonly startedAt: number | null;
}
interface FadeOutAction {
  readonly duration: number;
  readonly startedAt: number | null;
}

export class AudioSource extends Definable {
  private readonly _audioPath: string;
  private _fadeInAction: FadeInAction | null = null;
  private _fadeOutAction: FadeOutAction | null = null;
  private readonly _howl: Howl;
  private _play: Play | null = null;
  private _volume: number = 1;

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

  public applyVolume(volume: number): void {
    this._volume = volume;
    this.updateVolume();
  }

  public fadeIn(duration: number): void {
    if (this._play === null) {
      throw new Error(
        `An attempt was made to apply volume to AudioSource "${this._id}" with no play options.`,
      );
    }
    if (this._fadeOutAction !== null) {
      this._fadeOutAction = null;
    }
    const volumeChannel: VolumeChannel = getDefinable<VolumeChannel>(
      VolumeChannel,
      this._play.volumeChannelID,
    );
    this._fadeInAction = {
      duration,
      startedAt: state.values.currentTime,
    };
    const adjustedVolume: number =
      this._volume *
      (getMainAdjustedVolume(volumeChannel.volumeSliderElement.valueAsNumber) /
        100);
    this._howl.fade(0, adjustedVolume, duration);
  }

  public fadeOut(duration: number): void {
    if (this._play === null) {
      throw new Error(
        `An attempt was made to apply volume to AudioSource "${this._id}" with no play options.`,
      );
    }
    if (this._fadeInAction !== null) {
      this._fadeInAction = null;
    }
    const volumeChannel: VolumeChannel = getDefinable<VolumeChannel>(
      VolumeChannel,
      this._play.volumeChannelID,
    );
    const adjustedVolume: number =
      this._volume *
      (getMainAdjustedVolume(volumeChannel.volumeSliderElement.valueAsNumber) /
        100);
    this._fadeOutAction = {
      duration,
      startedAt: state.values.currentTime,
    };
    this._howl.fade(adjustedVolume, 0, duration);
    this._volume = 0;
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
    this._play = {
      loopPoint: playAudioOptions.loopPoint,
      volumeChannelID: playAudioOptions.volumeChannelID,
    };
    this.updateVolume();
    this._howl.play();
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
      const adjustedVolume: number =
        this._volume *
        (getMainAdjustedVolume(
          volumeChannel.volumeSliderElement.valueAsNumber,
        ) /
          100);
      if (this._fadeInAction !== null) {
        if (
          this._fadeInAction.startedAt !== null &&
          state.values.currentTime - this._fadeInAction.startedAt <
            this._fadeInAction.duration
        ) {
          const percent: number =
            (state.values.currentTime - this._fadeInAction.startedAt) /
            this._fadeInAction.duration;
          const duration: number =
            this._fadeInAction.duration -
            (state.values.currentTime - this._fadeInAction.startedAt);
          this._howl.fade(percent * adjustedVolume, adjustedVolume, duration);
        }
      } else if (this._fadeOutAction !== null) {
        if (
          this._fadeOutAction.startedAt !== null &&
          state.values.currentTime - this._fadeOutAction.startedAt <
            this._fadeOutAction.duration
        ) {
          const percent: number =
            1 -
            (state.values.currentTime - this._fadeOutAction.startedAt) /
              this._fadeOutAction.duration;
          const duration: number =
            this._fadeOutAction.duration -
            (state.values.currentTime - this._fadeOutAction.startedAt);
          this._howl.fade(percent * adjustedVolume, 0, duration);
        }
      } else {
        this._howl.volume(adjustedVolume);
      }
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
export interface ApplyAudioSourceVolumeOptions {
  volume: number;
}
export const applyAudioSourceVolume = (
  audioSourceID: string,
  options: ApplyAudioSourceVolumeOptions,
): void => {
  getDefinable<AudioSource>(AudioSource, audioSourceID).applyVolume(
    options.volume,
  );
};
export interface FadeInAudioSourceVolumeOptions {
  duration: number;
}
export const fadeInAudioSourceVolume = (
  audioSourceID: string,
  options: FadeInAudioSourceVolumeOptions,
): void => {
  getDefinable<AudioSource>(AudioSource, audioSourceID).fadeIn(
    options.duration,
  );
};
export interface FadeOutAudioSourceVolumeOptions {
  duration: number;
}
export const fadeOutAudioSourceVolume = (
  audioSourceID: string,
  options: FadeOutAudioSourceVolumeOptions,
): void => {
  getDefinable<AudioSource>(AudioSource, audioSourceID).fadeOut(
    options.duration,
  );
};
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
