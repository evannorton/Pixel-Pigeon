export interface Config {
  readonly height: number;
  readonly joystick?: {
    readonly size: number;
    readonly x: number;
    readonly y: number;
  };
  readonly name: string;
  readonly requireClickToFocus: boolean;
  readonly width: number;
}
