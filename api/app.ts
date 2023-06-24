import { Application } from "pixi.js";
import config from "../api/config";

const app: Application = new Application({
  height: config.height,
  width: config.width,
});

export default app;
