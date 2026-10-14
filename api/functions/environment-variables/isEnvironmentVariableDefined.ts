import { state } from "../../state";

export const isEnvironmentVariableDefined = (key: string): boolean => {
  if (state.values.gameEnv === null) {
    throw new Error(
      `Attempted to get environment variable "${key}" before game environment was loaded.`,
    );
  }
  return key in state.values.gameEnv;
};
