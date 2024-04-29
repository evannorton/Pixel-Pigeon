import { BitmapText, TextStyleAlign } from "pixi.js";
import { TextInfo, TextInfoTrim } from "../../types/TextInfo";
import { getBitmapText } from "../getBitmapText";
import { state } from "../../state";

export const drawText = (
  textInfo: TextInfo,
  color: string,
  x: number,
  y: number,
  size: number,
  maxWidth: number | null,
  maxLines: number | null,
  horizontalAlignment: TextStyleAlign,
  zIndex: number,
): void => {
  if (state.values.app === null) {
    throw new Error(
      "An attempt was made to draw a rectangle before app was created.",
    );
  }
  const areTrimsOverlapped: boolean = textInfo.trims.some(
    (trimA: TextInfoTrim): boolean =>
      textInfo.trims.some((trimB: TextInfoTrim): boolean => {
        if (trimA !== trimB) {
          const trimAIndices: number[] = [];
          for (
            let i: number = trimA.index;
            i < trimA.index + trimA.length;
            i++
          ) {
            trimAIndices.push(i);
          }
          const trimBIndices: number[] = [];
          for (
            let i: number = trimB.index;
            i < trimB.index + trimB.length;
            i++
          ) {
            trimBIndices.push(i);
          }
          return trimAIndices.some((index: number): boolean =>
            trimBIndices.includes(index),
          );
        }
        return false;
      }),
  );
  if (areTrimsOverlapped) {
    throw new Error("Attempted to draw text with overlapping trims.");
  }
  const sprite: BitmapText = getBitmapText(
    textInfo.value,
    textInfo.trims,
    color,
    size,
    maxWidth,
    maxLines,
    horizontalAlignment,
  );
  const startX: number = x - size;
  sprite.x =
    horizontalAlignment === "right"
      ? startX - sprite.width
      : horizontalAlignment === "center"
        ? startX - Math.floor(sprite.width / 2) - 1
        : startX;
  if (horizontalAlignment === "center" && sprite.width % 2 === 0) {
    sprite.x++;
  }
  sprite.y = y - size * 3;
  sprite.zIndex = zIndex;
  state.values.app.stage.addChild(sprite);
  state.setValues({
    renderChildrenToDestroy: [...state.values.renderChildrenToDestroy, sprite],
  });
};
