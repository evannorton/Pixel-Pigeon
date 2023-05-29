import Sprite from "../classes/Sprite";
import app from "../app";
import assetsAreLoaded from "./assetsAreLoaded";
import config from "../config";
import drawImage from "./draw/drawImage";
import drawRectangle from "./draw/drawRectangle";
import drawText from "./draw/drawText";
import getDefinables from "./getDefinables";
import getTotalAssets from "./getTotalAssets";
import state from "../state";

const render = (): void => {
  app.stage.removeChildren();
  drawRectangle("#000000", 1, 0, 0, config.width, config.height);
  if (!assetsAreLoaded()) {
    const current: number = state.loadedAssets;
    const total: number = getTotalAssets();
    const percent: number = current / total;
    const width: number = Math.floor(config.width * 0.625);
    const x: number = Math.floor((config.width - width) / 2);
    const height: number = 32;
    const y: number = Math.floor((config.height - height) / 2);
    drawRectangle("#343434", 1, x, y, width, height);
    drawRectangle("#7b7b7b", 1, x, y, Math.floor(width * percent), height);
  } else if (!state.hasInteracted) {
    drawText(
      "Click to focus",
      "#ffffff",
      Math.floor(config.width / 2),
      Math.floor(config.height / 2),
      1,
      config.width,
      1,
      "center",
      "middle"
    );
  } else {
    getDefinables(Sprite).forEach((sprite): void => {
      drawImage(
        sprite.slug,
        1,
        0,
        0,
        sprite.texture.width,
        sprite.texture.height,
        sprite.options.x,
        sprite.options.y,
        sprite.texture.width,
        sprite.texture.height
      );
    });
  }

  app.stage.sortChildren();
  app.render();
};

export default render;
