import { state } from "../state";

export const handleCaughtError = (error: unknown, descriptor: string): void => {
  if (state.values.type === null) {
    throw new Error(
      "An attempt was made to catch a tick error before type was loaded.",
    );
  }
  switch (state.values.type) {
    case "dev":
      throw error;
    case "zip":
      console.error(`Error thrown in ${descriptor}.`, "\n", error);
      break;
  }
};
