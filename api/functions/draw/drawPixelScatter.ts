import { Sprite as PixiSprite, Texture } from "pixi.js";
import { state } from "../../state";
import type { PixelScatter } from "../../types/PixelScatter";

const bayer8x8OrderedDitherThresholds: readonly (readonly number[])[] = [
  [0, 48, 12, 60, 3, 51, 15, 63],
  [32, 16, 44, 28, 35, 19, 47, 31],
  [8, 56, 4, 52, 11, 59, 7, 55],
  [40, 24, 36, 20, 43, 27, 39, 23],
  [2, 50, 14, 62, 1, 49, 13, 61],
  [34, 18, 46, 30, 33, 17, 45, 29],
  [10, 58, 6, 54, 9, 57, 5, 53],
  [42, 26, 38, 22, 41, 25, 37, 21],
];
const bayer8x8Scale: number = 64;
const bayerCellIndexMod8 = (cellIndex: number): number => {
  const remainder: number = cellIndex % 8;
  if (remainder < 0) {
    return remainder + 8;
  }
  return remainder;
};
let workCanvas: HTMLCanvasElement | null = null;
let workCanvasContext: CanvasRenderingContext2D | null = null;
let cachedImageData: ImageData | null = null;
const getPixelScatterResolvedProgress = (): number | null => {
  const scatter: PixelScatter | null = state.values.pixelScatter;
  if (scatter === null) {
    throw new Error(
      "An attempt was made to get the resolved progress of PixelScatter before it was started.",
    );
  }
  if (scatter.startedAt !== null && scatter.duration !== null) {
    if (scatter.duration <= 0) {
      return 1;
    }
    const elapsedMilliseconds: number =
      state.values.currentTime - scatter.startedAt;
    const linearProgress: number = elapsedMilliseconds / scatter.duration;
    if (linearProgress >= 1) {
      return 1;
    }
    return linearProgress;
  }
  return scatter.progress;
};

export const drawPixelScatter = (): void => {
  if (state.values.pixelScatter === null) {
    throw new Error(
      "An attempt was made to draw PixelScatter before it was started.",
    );
  }
  const scatterProgress: number | null = getPixelScatterResolvedProgress();
  if (scatterProgress !== null) {
    const cellPixelSize: number = state.values.pixelScatter.size;
    const scatterOffsetX: number = state.values.pixelScatter.offsetX;
    const scatterOffsetY: number = state.values.pixelScatter.offsetY;
    if (state.values.app === null) {
      throw new Error(
        "An attempt was made to draw PixelScatter before app was created.",
      );
    }
    if (state.values.config === null) {
      throw new Error(
        "An attempt was made to draw PixelScatter before config was loaded.",
      );
    }
    const canvasPixelWidth: number = state.values.config.width;
    const canvasPixelHeight: number = state.values.config.height;
    if (workCanvas === null) {
      workCanvas = document.createElement("canvas");
      workCanvasContext = workCanvas.getContext("2d");
    }
    if (workCanvasContext === null) {
      throw new Error(
        "A 2D canvas context could not be created for PixelScatter.",
      );
    }
    if (
      workCanvas.width !== canvasPixelWidth ||
      workCanvas.height !== canvasPixelHeight
    ) {
      workCanvas.width = canvasPixelWidth;
      workCanvas.height = canvasPixelHeight;
      cachedImageData = null;
    }
    if (
      cachedImageData === null ||
      cachedImageData.width !== canvasPixelWidth ||
      cachedImageData.height !== canvasPixelHeight
    ) {
      cachedImageData = workCanvasContext.createImageData(
        canvasPixelWidth,
        canvasPixelHeight,
      );
    }
    const imageData: ImageData = cachedImageData;
    const pixels: Uint32Array = new Uint32Array(
      imageData.data.buffer,
      imageData.data.byteOffset,
      imageData.data.length / 4,
    );
    const opaqueBlackPixel: number = 0xff000000;
    const transparentPixel: number = 0x00000000;
    let pixelWriteIndex: number = 0;
    for (let y: number = 0; y < canvasPixelHeight; y++) {
      const shiftedY: number = y + scatterOffsetY;
      const bayerRowIndex: number = bayerCellIndexMod8(
        Math.floor(shiftedY / cellPixelSize),
      );
      for (let x: number = 0; x < canvasPixelWidth; x++) {
        const shiftedX: number = x + scatterOffsetX;
        const bayerColumnIndex: number = bayerCellIndexMod8(
          Math.floor(shiftedX / cellPixelSize),
        );
        const bayerThreshold: number | undefined =
          bayer8x8OrderedDitherThresholds[bayerRowIndex]?.[bayerColumnIndex];
        if (bayerThreshold === undefined) {
          throw new Error("Bayer dither matrix lookup was out of bounds.");
        }
        const normalizedBayerThreshold: number =
          (bayerThreshold + 0.5) / bayer8x8Scale;
        let pixelIsBlack: boolean = false;
        if (normalizedBayerThreshold < scatterProgress) {
          pixelIsBlack = true;
        }
        if (pixelIsBlack) {
          pixels[pixelWriteIndex] = opaqueBlackPixel;
        } else {
          pixels[pixelWriteIndex] = transparentPixel;
        }
        pixelWriteIndex++;
      }
    }
    workCanvasContext.putImageData(imageData, 0, 0);
    const overlayTexture: Texture = Texture.from(workCanvas);
    const overlaySprite: PixiSprite = new PixiSprite(overlayTexture);
    overlaySprite.zIndex = 1_000_000;
    overlaySprite.x = 0;
    overlaySprite.y = 0;
    state.values.app.stage.addChild(overlaySprite);
    state.setValues({
      renderChildrenToDestroy: [
        ...state.values.renderChildrenToDestroy,
        overlaySprite,
      ],
    });
  }
};
