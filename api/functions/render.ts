import Sprite from "../classes/Sprite";
import assetsAreLoaded from "./assetsAreLoaded";
import drawRectangle from "./draw/drawRectangle";
import drawText from "./draw/drawText";
import getDefinables from "./getDefinables";
import getTotalAssets from "./getTotalAssets";
import state from "../state";

const render = (): void => {
  if (state.values.app === null) {
    throw new Error("An attempt was made to render before app was created.");
  }
  if (state.values.config === null) {
    throw new Error("An attempt was made to render before config was loaded.");
  }
  state.values.app.stage.removeChildren();
  drawRectangle(
    "#000000",
    1,
    0,
    0,
    state.values.config.width,
    state.values.config.height
  );
  if (!assetsAreLoaded()) {
    const current: number = state.values.loadedAssets;
    const total: number = getTotalAssets();
    const percent: number = current / total;
    const width: number = Math.floor(state.values.config.width * 0.625);
    const x: number = Math.floor((state.values.config.width - width) / 2);
    const height: number = 32;
    const y: number = Math.floor((state.values.config.height - height) / 2);
    drawRectangle("#343434", 1, x, y, width, height);
    drawRectangle("#7b7b7b", 1, x, y, Math.floor(width * percent), height);
  } else if (!state.values.hasInteracted) {
    drawText(
      "Click to focus",
      "#ffffff",
      Math.floor(state.values.config.width / 2),
      Math.floor(state.values.config.height / 2),
      1,
      state.values.config.width,
      1,
      "center",
      "middle"
    );
  } else {
    getDefinables(Sprite).forEach((sprite: Sprite): void => {
      sprite.attemptDraw();
    });
  }
  state.values.app.stage.sortChildren();
  state.values.app.render();
};

export default render;
