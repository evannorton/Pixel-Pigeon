import { handleCaughtError } from "./handleCaughtError";

export const handleError = (error: unknown): void => {
  if (error !== null && typeof error === "object" && error instanceof Error) {
    handleCaughtError(error, "game", true);
  }
};
