import render from "./render";
import state from "../state";
import update from "./update";

const tick = (): void => {
  if (state.values.app === null) {
    throw new Error("An attempt was made to tick before app was created.");
  }
  state.setValues({
    currentTime: state.values.currentTime + state.values.app.ticker.deltaMS,
  });
  update();
  render();
};

export default tick;
