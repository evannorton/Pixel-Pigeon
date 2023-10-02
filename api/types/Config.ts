export interface VolumeChannelConfig {
  readonly id: string;
  readonly name: string;
}
export interface Config {
  readonly height: number;
  readonly volumeChannels: VolumeChannelConfig[];
  readonly width: number;
}
