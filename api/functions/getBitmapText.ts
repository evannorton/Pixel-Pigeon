import { BitmapText, TextStyleAlign } from "pixi.js";

const regex: RegExp = new RegExp("\\*", "gu");

export const getBitmapText = (
  text: string,
  color: string,
  size: number,
  maxWidth: number,
  maxLines: number,
  horizontalAlignment: TextStyleAlign,
): BitmapText => {
  const replaced: string = text.replace(regex, "");
  const bitmapText: BitmapText = new BitmapText(replaced, {
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
  const indices: number[] = [];
  text.split("").forEach((char: string, key: number): void => {
    if (char === "*") {
      indices.push(key);
    }
  });
  const asterisks: {
    index: number;
    word: string;
  }[] = [];
  indices.forEach((index: number): void => {
    const fragment: string = text.substring(0, index);
    const wordStart: number = Math.max(0, fragment.lastIndexOf(" "));
    asterisks.push({
      index,
      word: fragment.substring(wordStart),
    });
  });
  const sortedAsterisks: {
    index: number;
    word: string;
  }[] = [...asterisks].sort(
    (
      asterisk1: {
        index: number;
        word: string;
      },
      asterisk2: {
        index: number;
        word: string;
      },
    ): number => {
      const word1BitmapText: BitmapText = new BitmapText(asterisk1.word, {
        align: horizontalAlignment,
        fontName: "RetroPixels",
        fontSize: size * 16,
      });
      const word2BitmapText: BitmapText = new BitmapText(asterisk2.word, {
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
  const pieces: string[] = text.split("");
  if (sortedAsterisks.length > 0) {
    const asterisk: {
      index: number;
      word: string;
    } = sortedAsterisks[0];
    pieces.splice(asterisk.index - 1, 1);
  }
  const joined: string = pieces.join("");
  if (joined === text) {
    throw new Error(
      `Text "${text}" of max width ${maxWidth} and lines ${maxLines} does not fit.`,
    );
  }
  return getBitmapText(
    joined,
    color,
    size,
    maxWidth,
    maxLines,
    horizontalAlignment,
  );
};
