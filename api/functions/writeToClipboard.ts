import { ClipboardMessage } from "../classes/ClipboardMessage";
import { postWindowMessage } from "./postWindowMessage";
import { state } from "../state";

export interface WriteToClipboardOptions {
  data: string | Blob;
  onError?: (error?: unknown) => void;
  onSuccess?: () => void;
}
export const writeToClipboard = ({
  data,
  onError,
  onSuccess,
}: WriteToClipboardOptions): void => {
  switch (state.values.env?.clipboardMode) {
    case "navigator": {
      const writePromise: Promise<void> =
        typeof data === "string"
          ? navigator.clipboard.writeText(data)
          : navigator.clipboard.write([
              new ClipboardItem({ [data.type]: data }),
            ]);
      writePromise
        .then((): void => {
          onSuccess?.();
        })
        .catch((error: unknown): void => {
          onError?.(error);
        });
      break;
    }
    case "post-message": {
      const clipboardMessage: ClipboardMessage = new ClipboardMessage({
        onError,
        onSuccess,
      });
      postWindowMessage({
        data: {
          data,
          id: clipboardMessage.id,
        },
        event: "pp-clipboard",
      });
      break;
    }
  }
};
