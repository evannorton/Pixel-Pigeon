import { handleCaughtError } from "./handleCaughtError";

export const handleError = (error: Error): void => {
  handleCaughtError(error, "game", true);
};
