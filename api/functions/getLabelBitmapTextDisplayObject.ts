import {
  BitmapFont,
  BitmapText,
  Container,
  IBitmapFontCharacter,
  TextStyleAlign,
} from "pixi.js";
import { TextInfoColor, TextInfoTrim } from "../types/TextInfo";
import { getBitmapText } from "./getBitmapText";

interface ColorRun {
  color: string;
  startIndex: number;
  text: string;
}
const getLabelBitmapFontSize = (size: number): number => size * 16;
const buildCharacterIndexLayoutOffsetXs = (
  fullText: string,
  fontSize: number,
): number[] => {
  const bitmapFont: BitmapFont | undefined =
    BitmapFont.available["RetroPixels"];
  if (typeof bitmapFont === "undefined") {
    throw new Error("Missing BitmapFont");
  }
  const scale: number = fontSize / bitmapFont.size;
  const normalizedText: string = fullText.replace(/(?:\r\n|\r)/gu, "\n");
  const characterOffsetXs: number[] = new Array(normalizedText.length + 1).fill(
    0,
  ) as number[];
  let positionX: number = 0;
  let previousCharacterCode: number | null = null;
  for (
    let characterIndex: number = 0;
    characterIndex < normalizedText.length;
    characterIndex++
  ) {
    const character: string = normalizedText[characterIndex] ?? "";
    if (character === "\n") {
      characterOffsetXs[characterIndex] = positionX * scale;
      positionX = 0;
      previousCharacterCode = null;
      continue;
    }
    const characterCode: number = character.codePointAt(0) ?? 0;
    const characterData: IBitmapFontCharacter | undefined =
      bitmapFont.chars[characterCode];
    if (
      typeof characterData !== "undefined" &&
      previousCharacterCode !== null
    ) {
      const kerningOffset: number | undefined =
        characterData.kerning[previousCharacterCode];
      if (typeof kerningOffset !== "undefined") {
        positionX += kerningOffset;
      }
    }
    characterOffsetXs[characterIndex] = positionX * scale;
    if (typeof characterData !== "undefined") {
      positionX += characterData.xAdvance;
      previousCharacterCode = characterCode;
    }
  }
  characterOffsetXs[normalizedText.length] = positionX * scale;
  return characterOffsetXs;
};
const getCharacterIndexOffsetY = (
  fullText: string,
  characterIndex: number,
  size: number,
): number => {
  const textBeforeIndex: string = fullText.substring(0, characterIndex);
  const lineBreakMatches: RegExpMatchArray | null =
    textBeforeIndex.match(/(?:\r\n|\r|\n)/gu);
  const lineNumber: number =
    lineBreakMatches === null ? 0 : lineBreakMatches.length;
  return lineNumber * size * 11;
};
const splitTextIntoColorRuns = (
  text: string,
  baseColor: string,
  colors: TextInfoColor[],
): ColorRun[] => {
  const filteredColors: TextInfoColor[] = colors
    .filter(
      (textColor: TextInfoColor): boolean =>
        textColor.length > 0 && textColor.index < text.length,
    )
    .sort(
      (colorA: TextInfoColor, colorB: TextInfoColor): number =>
        colorA.index - colorB.index,
    );
  const colorRuns: ColorRun[] = [];
  let currentCharacterIndex: number = 0;
  for (const textColor of filteredColors) {
    const colorStartIndex: number = textColor.index;
    const colorEndIndex: number = Math.min(
      colorStartIndex + textColor.length,
      text.length,
    );
    if (colorStartIndex > currentCharacterIndex) {
      colorRuns.push({
        color: baseColor,
        startIndex: currentCharacterIndex,
        text: text.substring(currentCharacterIndex, colorStartIndex),
      });
    }
    if (colorEndIndex > colorStartIndex) {
      colorRuns.push({
        color: textColor.color,
        startIndex: colorStartIndex,
        text: text.substring(colorStartIndex, colorEndIndex),
      });
    }
    currentCharacterIndex = Math.max(currentCharacterIndex, colorEndIndex);
  }
  if (currentCharacterIndex < text.length) {
    colorRuns.push({
      color: baseColor,
      startIndex: currentCharacterIndex,
      text: text.substring(currentCharacterIndex),
    });
  }
  return colorRuns;
};
const getContainerTextWidth = (container: Container): number => {
  let maxWidth: number = 0;
  for (const child of container.children) {
    if (child instanceof BitmapText) {
      maxWidth = Math.max(maxWidth, child.x + child.width);
    }
  }
  return maxWidth;
};
const getContainerTextHeight = (container: Container): number => {
  let maxHeight: number = 0;
  for (const child of container.children) {
    if (child instanceof BitmapText) {
      maxHeight = Math.max(maxHeight, child.y + child.height);
    }
  }
  return maxHeight;
};
const layoutColorRunsIntoContainer = (
  fullText: string,
  colorRuns: ColorRun[],
  size: number,
): Container => {
  const container: Container = new Container();
  const fontSize: number = getLabelBitmapFontSize(size);
  const characterOffsetXs: number[] = buildCharacterIndexLayoutOffsetXs(
    fullText,
    fontSize,
  );
  for (const colorRun of colorRuns) {
    const lineParts: string[] = colorRun.text.split(/(?:\r\n|\r|\n)/u);
    let runCharacterOffset: number = 0;
    for (const linePartText of lineParts) {
      if (typeof linePartText === "undefined" || linePartText.length === 0) {
        const lineBreakMatch: RegExpMatchArray | null = /^(?:\r\n|\r|\n)/u.exec(
          colorRun.text.substring(runCharacterOffset),
        );
        if (lineBreakMatch !== null) {
          runCharacterOffset += lineBreakMatch[0].length;
        }
        continue;
      }
      const partStartIndex: number = colorRun.startIndex + runCharacterOffset;
      const runBitmapText: BitmapText = new BitmapText(linePartText, {
        align: "left",
        fontName: "RetroPixels",
        fontSize,
        tint: Number(`0x${colorRun.color.substring(1)}`),
      });
      runBitmapText.x = characterOffsetXs[partStartIndex] ?? 0;
      runBitmapText.y = getCharacterIndexOffsetY(
        fullText,
        partStartIndex,
        size,
      );
      runCharacterOffset += linePartText.length;
      const lineBreakMatch: RegExpMatchArray | null = /^(?:\r\n|\r|\n)/u.exec(
        colorRun.text.substring(runCharacterOffset),
      );
      if (lineBreakMatch !== null) {
        runCharacterOffset += lineBreakMatch[0].length;
      }
      container.addChild(runBitmapText);
    }
  }
  return container;
};
const getBitmapTextContainerWithColors = (
  text: string,
  trims: TextInfoTrim[],
  colors: TextInfoColor[],
  baseColor: string,
  size: number,
  maxWidth: number | null,
  maxLines: number | null,
  horizontalAlignment: TextStyleAlign,
): Container => {
  const effectiveMaxWidth: number | null =
    maxWidth !== null ? maxWidth + 2 * size : null;
  const colorRuns: ColorRun[] = splitTextIntoColorRuns(text, baseColor, colors);
  const container: Container = layoutColorRunsIntoContainer(
    text,
    colorRuns,
    size,
  );
  const isTooWide: boolean =
    effectiveMaxWidth !== null &&
    getContainerTextWidth(container) > effectiveMaxWidth;
  const isTooTall: boolean =
    maxLines !== null &&
    getContainerTextHeight(container) > size * maxLines * 11;
  if (isTooWide || isTooTall) {
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
      container.destroy({ children: true });
      return getBitmapTextContainerWithColors(
        `${text.substring(0, trimCharacterIndex)}${text.substring(
          trimCharacterIndex + 1,
        )}`,
        trims.map(
          (trim: TextInfoTrim): TextInfoTrim => ({
            index:
              trimCharacterIndex < trim.index ? trim.index - 1 : trim.index,
            length:
              trim.index === trimToApply.index ? trim.length - 1 : trim.length,
          }),
        ),
        colors
          .map(
            (textColor: TextInfoColor): TextInfoColor => ({
              color: textColor.color,
              index:
                trimCharacterIndex < textColor.index
                  ? textColor.index - 1
                  : textColor.index,
              length:
                trimCharacterIndex >= textColor.index &&
                trimCharacterIndex < textColor.index + textColor.length
                  ? textColor.length - 1
                  : textColor.length,
            }),
          )
          .filter((textColor: TextInfoColor): boolean => textColor.length > 0),
        baseColor,
        size,
        maxWidth,
        maxLines,
        horizontalAlignment,
      );
    }
  }
  if (isTooWide) {
    if (maxWidth === null) {
      throw new Error(
        "Text exceeded maximum width without a maximum width set",
      );
    }
    console.error(
      `Text exceeded maximum width: "${text}" (${getContainerTextWidth(
        container,
      )} / ${maxWidth})`,
    );
  }
  if (isTooTall) {
    console.error(`Text exceeded maximum lines: "${text}"`);
  }
  return container;
};

export const getLabelBitmapTextDisplayObject = (
  text: string,
  trims: TextInfoTrim[],
  colors: TextInfoColor[],
  baseColor: string,
  size: number,
  maxWidth: number | null,
  maxLines: number | null,
  horizontalAlignment: TextStyleAlign,
): Container => {
  if (colors.length === 0) {
    const container: Container = new Container();
    container.addChild(
      getBitmapText(
        text,
        trims,
        baseColor,
        size,
        maxWidth,
        maxLines,
        horizontalAlignment,
      ),
    );
    return container;
  }
  return getBitmapTextContainerWithColors(
    text,
    trims,
    colors,
    baseColor,
    size,
    maxWidth,
    maxLines,
    horizontalAlignment,
  );
};
