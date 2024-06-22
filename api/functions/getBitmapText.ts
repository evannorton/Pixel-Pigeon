import { BitmapText, IBitmapTextStyle, TextStyleAlign } from "pixi.js";
import { TextInfoTrim } from "../types/TextInfo";

export const getBitmapText = (
  text: string,
  trims: TextInfoTrim[],
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
    bitmapTextStyle.maxWidth = maxWidth + 2 * size;
  }
  const bitmapText: BitmapText = new BitmapText(text, bitmapTextStyle);
  const isTooWide: boolean = maxWidth !== null && bitmapText.width > maxWidth;
  const isTooTall: boolean =
    maxLines !== null && bitmapText.textHeight > size * maxLines * 11;
  if (isTooWide === false && isTooTall === false) {
    return bitmapText;
  }
  const filteredTrims: TextInfoTrim[] = trims.filter(
    (trim: TextInfoTrim): boolean =>
      trim.length > 0 && trim.index < text.length,
  );
  const sortedTrims: TextInfoTrim[] = filteredTrims.sort(
    (trimA: TextInfoTrim, trimB: TextInfoTrim): number => {
      const fragmentA: string = text.substring(
        trimA.index,
        trimA.index + trimA.length,
      );
      const fragmentB: string = text.substring(
        trimB.index,
        trimB.index + trimB.length,
      );
      const word1BitmapText: BitmapText = new BitmapText(fragmentA, {
        align: horizontalAlignment,
        fontName: "RetroPixels",
        fontSize: size * 16,
      });
      const word2BitmapText: BitmapText = new BitmapText(fragmentB, {
        align: horizontalAlignment,
        fontName: "RetroPixels",
        fontSize: size * 16,
      });
      const diff: number = word2BitmapText.width - word1BitmapText.width;
      word1BitmapText.destroy();
      word2BitmapText.destroy();
      return diff;
    },
  );
  const trimToApply: TextInfoTrim | undefined = sortedTrims[0];
  if (typeof trimToApply !== "undefined") {
    const trimCharacterIndex: number =
      trimToApply.index + trimToApply.length - 1;
    bitmapText.destroy();
    return getBitmapText(
      `${text.substring(0, trimCharacterIndex)}${text.substring(
        trimCharacterIndex + 1,
      )}`,
      trims.map(
        (trim: TextInfoTrim): TextInfoTrim => ({
          index: trimCharacterIndex < trim.index ? trim.index - 1 : trim.index,
          length:
            trim.index === trimToApply.index ? trim.length - 1 : trim.length,
        }),
      ),
      color,
      size,
      maxWidth,
      maxLines,
      horizontalAlignment,
    );
  }
  if (isTooWide) {
    throw new Error(`Text exceeded maximum width: ${text}`);
  }
  throw new Error(`Text exceeded maximum lines: ${text}`);
};
