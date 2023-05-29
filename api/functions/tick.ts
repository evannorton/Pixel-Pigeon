import app from "../app";
import render from "./render";
import state from "../state";
import update from "./update";

const tick = (): void => {
  state.currentTime += app.ticker.deltaMS;
  update();
  render();
};

export default tick;
