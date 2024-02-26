import { BitmapText, TextStyleAlign } from "pixi.js";

export const getBitmapText = (
  text: string,
  color: string,
  size: number,
  maxWidth: number,
  maxLines: number,
  horizontalAlignment: TextStyleAlign,
): BitmapText => {
  const bitmapText: BitmapText = new BitmapText(text, {
    align: horizontalAlignment,
    fontName: "RetroPixels",
    fontSize: size * 16,
    maxWidth,
    tint: Number(`0x${color.substring(1)}`),
  });
  if (
    bitmapText.textHeight <= size * maxLines * 11 &&
    bitmapText.textWidth <= maxWidth
  ) {
    return bitmapText;
  }
  bitmapText.destroy();
  return getBitmapText(
    text,
    color,
    size,
    maxWidth,
    maxLines,
    horizontalAlignment,
  );
};
