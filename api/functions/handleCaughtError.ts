import { getDefaultedError } from "./getDefaultedError";
import { state } from "../state";

export const handleCaughtError = (
  error: unknown,
  descriptor: string,
  shouldUseCallbacks: boolean,
): void => {
  if (state.values.type === null) {
    throw new Error(
      "An attempt was made to catch an error before type was loaded.",
    );
  }
  const defaultedError: Error = getDefaultedError(error);
  if (shouldUseCallbacks) {
    for (const onErrorCallback of state.values.onErrorCallbacks) {
      try {
        onErrorCallback(defaultedError);
      } catch (onErrorCallbackError: unknown) {
        handleCaughtError(onErrorCallbackError, "on error callback", false);
      }
    }
  }
  switch (state.values.type) {
    case "dev":
      handleUncaughtError(defaultedError);
      break;
    case "zip":
      console.error(`Error thrown in ${descriptor}.`, "\n", defaultedError);
      break;
  }
};
