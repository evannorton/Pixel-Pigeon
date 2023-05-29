import { Graphics } from "pixi.js";
import app from "../../app";

const drawRectangle = (
  color: string,
  opacity: number,
  x: number,
  y: number,
  width: number,
  height: number
): void => {
  const rectangle: Graphics = new Graphics();
  rectangle.beginFill(Number(`0x${color.substring(1)}`));
  rectangle.lineStyle(0, Number(`0x${color.substring(1)}`));
  rectangle.drawRect(x, y, width, height);
  rectangle.alpha = opacity;
  app.stage.addChild(rectangle);
};

export default drawRectangle;
