import state from "../state";

const goToLevel = (levelID: string): void => {
  state.setValues({ levelID });
};

export default goToLevel;
