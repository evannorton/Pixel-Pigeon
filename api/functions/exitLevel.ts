import { state } from "../state";

export const exitLevel = (): void => {
  state.setValues({
    levelID: null,
  });
};
