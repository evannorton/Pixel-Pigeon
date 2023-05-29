import app from "pigeon-mode-game-library/api/app";
import render from "pigeon-mode-game-library/api/functions/render";
import state from "pigeon-mode-game-library/api/state";
import update from "pigeon-mode-game-library/api/functions/update";

const tick = (): void => {
  state.currentTime += app.ticker.deltaMS;
  update();
  render();
};

export default tick;
