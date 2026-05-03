import { Definable } from "definables";

export interface ClipboardMessageOptions {
  onSuccess?: () => void;
  onError?: () => void;
}
export class ClipboardMessage extends Definable {
  private readonly _onError?: () => void;
  private readonly _onSuccess?: () => void;
  public constructor(options: ClipboardMessageOptions) {
    super();
    this._onSuccess = options.onSuccess;
    this._onError = options.onError;
  }

  public onSuccess(): void {
    this._onSuccess?.();
  }

  public onError(): void {
    this._onError?.();
  }
}
