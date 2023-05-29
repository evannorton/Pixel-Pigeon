import { Application } from "pixi.js";
import config from "../api/config";

const app = new Application({
  height: config.height,
  width: config.width,
});

export default app;
