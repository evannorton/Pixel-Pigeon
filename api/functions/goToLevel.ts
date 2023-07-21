import { state } from "../state";

export const goToLevel = (levelID: string): void => {
  state.setValues({ levelID });
};
