import { BitmapText, IBitmapTextStyle, TextStyleAlign } from "pixi.js";

export const getBitmapText = (
  text: string,
  color: string,
  size: number,
  maxWidth: number | null,
  maxLines: number | null,
  horizontalAlignment: TextStyleAlign,
): BitmapText => {
  const bitmapTextStyle: Partial<IBitmapTextStyle> = {
    align: horizontalAlignment,
    fontName: "RetroPixels",
    fontSize: size * 16,
    tint: Number(`0x${color.substring(1)}`),
  };
  if (maxWidth !== null) {
    bitmapTextStyle.maxWidth = maxWidth + 2;
  }
  const bitmapText: BitmapText = new BitmapText(text, bitmapTextStyle);
  if (maxWidth !== null && bitmapText.width > maxWidth) {
    throw new Error(`Text exceeded maximum width: ${text}`);
  }
  if (maxLines !== null && bitmapText.textHeight > size * maxLines * 11) {
    throw new Error(`Text exceeded maximum lines: ${text}`);
  }
  return bitmapText;
};
