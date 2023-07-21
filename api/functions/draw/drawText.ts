import { BitmapText, TextStyleAlign, TextStyleTextBaseline } from "pixi.js";
import { getBitmapText } from "../getBitmapText";
import { state } from "../../state";

export const drawText = (
  text: string,
  color: string,
  x: number,
  y: number,
  size: number,
  maxWidth: number,
  maxLines: number,
  horizontalAlignment: TextStyleAlign,
  verticalAlignment: TextStyleTextBaseline
): void => {
  if (state.values.app === null) {
    throw new Error(
      "An attempt was made to draw a rectangle before app was created."
    );
  }
  const sprite: BitmapText = getBitmapText(
    text,
    color,
    size,
    maxWidth,
    maxLines,
    horizontalAlignment
  );
  const startX: number = x - size;
  sprite.x =
    horizontalAlignment === "right"
      ? startX - sprite.width
      : horizontalAlignment === "center"
      ? startX - Math.ceil(sprite.width / 2)
      : startX;
  sprite.y =
    verticalAlignment === "bottom"
      ? y + size * 3
      : verticalAlignment === "middle"
      ? y
      : y - size * 3;
  sprite.anchor.set(
    0,
    verticalAlignment === "bottom"
      ? 1
      : verticalAlignment === "middle"
      ? (size * 7) / 2 / (size * 7)
      : 0
  );
  state.values.app.stage.addChild(sprite);
};
