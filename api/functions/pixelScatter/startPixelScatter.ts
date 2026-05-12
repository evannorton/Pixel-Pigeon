import { state } from "../../state";

const normalizePixelScatterCellPixelSize = (
  cellPixelSize: number | undefined,
): number => {
  if (typeof cellPixelSize === "undefined") {
    return 1;
  }
  const flooredCellPixelSize: number = Math.floor(cellPixelSize);
  if (flooredCellPixelSize < 1) {
    return 1;
  }
  return flooredCellPixelSize;
};
const normalizePixelScatterOffset = (
  offsetPixels: number | undefined,
): number => {
  if (typeof offsetPixels === "undefined") {
    return 0;
  }
  return offsetPixels;
};

export interface StartPixelScatterOptions {
  readonly duration: number;
  readonly offsetX?: number;
  readonly offsetY?: number;
  readonly size?: number;
}
export const startPixelScatter = (options: StartPixelScatterOptions): void => {
  const normalizedCellPixelSize: number = normalizePixelScatterCellPixelSize(
    options.size,
  );
  const normalizedOffsetX: number = normalizePixelScatterOffset(
    options.offsetX,
  );
  const normalizedOffsetY: number = normalizePixelScatterOffset(
    options.offsetY,
  );
  state.setValues({
    pixelScatter: {
      duration: options.duration,
      offsetX: normalizedOffsetX,
      offsetY: normalizedOffsetY,
      progress: 0,
      size: normalizedCellPixelSize,
      startedAt: state.values.currentTime,
    },
  });
};
