import { Application } from "pixi.js";
import config from "pigeon-mode-game-library/api/config";

const app = new Application({
  height: config.height,
  width: config.width,
});

export default app;
