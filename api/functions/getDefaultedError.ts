export const getDefaultedError = (error: unknown): Error => {
  if (error !== null && typeof error === "object" && error instanceof Error) {
    return error;
  }
  return new Error(JSON.stringify(error));
};
