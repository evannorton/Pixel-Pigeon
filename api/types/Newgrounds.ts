export interface Newgrounds {
  readonly session_id: string | null;
  callComponent(componentID: string, options: unknown): void;
  executeQueue(): void;
  queueComponent(
    componentID: string,
    options: unknown,
    callback: (arg: unknown) => void,
  ): void;
}
export interface NewgroundsMedal {
  readonly id: number;
  readonly unlocked: boolean;
}
