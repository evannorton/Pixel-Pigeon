import { TextInfoColor } from "../types/TextInfo";

export const textInfoColorsHaveSameValues = (
  colorsA: TextInfoColor[],
  colorsB: TextInfoColor[],
): boolean => {
  if (colorsA.length !== colorsB.length) {
    return false;
  }
  const sortedColorsA: TextInfoColor[] = [...colorsA].sort(
    (colorA: TextInfoColor, colorB: TextInfoColor): number =>
      colorA.index - colorB.index,
  );
  const sortedColorsB: TextInfoColor[] = [...colorsB].sort(
    (colorA: TextInfoColor, colorB: TextInfoColor): number =>
      colorA.index - colorB.index,
  );
  for (
    let colorIndex: number = 0;
    colorIndex < sortedColorsA.length;
    colorIndex++
  ) {
    const colorA: TextInfoColor | undefined = sortedColorsA[colorIndex];
    const colorB: TextInfoColor | undefined = sortedColorsB[colorIndex];
    if (typeof colorA === "undefined" || typeof colorB === "undefined") {
      return false;
    }
    if (
      colorA.color !== colorB.color ||
      colorA.index !== colorB.index ||
      colorA.length !== colorB.length
    ) {
      return false;
    }
  }
  return true;
};
