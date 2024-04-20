import { state } from "../state";

export const getEnvironmentVariable = (key: string): unknown => {
  if (state.values.gameEnv === null) {
    throw new Error(
      `Attempted to get environment variable "${key}" before game environment was loaded.`,
    );
  }
  if (key in state.values.gameEnv) {
    return state.values.gameEnv[key];
  }
  throw new Error(
    `Attempted to get non-existant environment variable "${key}".`,
  );
};
