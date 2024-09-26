import { state } from "../state";

export const handleCaughtError = (
  error: unknown,
  descriptor: string,
  shouldUseCallbacks: boolean,
): void => {
  if (state.values.type === null) {
    throw new Error(
      "An attempt was made to catch a tick error before type was loaded.",
    );
  }
  if (error instanceof Error) {
    if (shouldUseCallbacks) {
      for (const onErrorCallback of state.values.onErrorCallbacks) {
        try {
          onErrorCallback(error);
        } catch (onErrorCallbackError: unknown) {
          handleCaughtError(onErrorCallbackError, "on error callback", false);
        }
      }
    }
    switch (state.values.type) {
      case "dev":
        throw error;
      case "zip":
        console.error(`Error thrown in ${descriptor}.`, "\n", error);
        break;
    }
  }
};
