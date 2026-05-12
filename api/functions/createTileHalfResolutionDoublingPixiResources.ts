import { Sprite as PixiSprite, RenderTexture, SCALE_MODES } from "pixi.js";

export interface LayerTileTilemapDoublingPixiResourceSlots {
  tileDoubledDisplayPixiSprite: PixiSprite | null;
  tileHalfResolutionRenderTexture: RenderTexture | null;
}
export interface TileHalfResolutionDoublingPixiResources {
  readonly tileDoubledDisplayPixiSprite: PixiSprite;
  readonly tileHalfResolutionRenderTexture: RenderTexture;
}
export const getTilemapDownsampledTilePixelSize = (
  fullTilePixelSize: number,
  tilemapDownsampleScale: number,
): number => {
  const normalizedTilemapDownsampleScale: number = Math.max(
    1,
    tilemapDownsampleScale,
  );
  return Math.max(
    1,
    Math.floor(fullTilePixelSize / normalizedTilemapDownsampleScale),
  );
};
export const createTileHalfResolutionDoublingPixiResources = (
  fullTilePixelSize: number,
  tilemapDownsampleScale: number,
): TileHalfResolutionDoublingPixiResources => {
  const downsampledResolution: number = getTilemapDownsampledTilePixelSize(
    fullTilePixelSize,
    tilemapDownsampleScale,
  );
  const tileHalfResolutionRenderTexture: RenderTexture = RenderTexture.create({
    height: downsampledResolution,
    scaleMode: SCALE_MODES.NEAREST,
    width: downsampledResolution,
  });
  const tileDoubledDisplayPixiSprite: PixiSprite = new PixiSprite(
    tileHalfResolutionRenderTexture,
  );
  return {
    tileDoubledDisplayPixiSprite,
    tileHalfResolutionRenderTexture,
  };
};
export const ensureLayerTileTilemapDoublingPixiResources = (
  tile: LayerTileTilemapDoublingPixiResourceSlots,
  fullTilePixelSize: number,
  tilemapDownsampleScale: number,
): void => {
  if (tile.tileHalfResolutionRenderTexture !== null) {
    return;
  }
  const created: TileHalfResolutionDoublingPixiResources =
    createTileHalfResolutionDoublingPixiResources(
      fullTilePixelSize,
      tilemapDownsampleScale,
    );
  tile.tileHalfResolutionRenderTexture =
    created.tileHalfResolutionRenderTexture;
  tile.tileDoubledDisplayPixiSprite = created.tileDoubledDisplayPixiSprite;
};
