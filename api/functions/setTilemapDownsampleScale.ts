import { state } from "../state";

export const setTilemapDownsampleScale = (
  tilemapDownsampleScale: number,
): void => {
  state.setValues({ tilemapDownsampleScale });
};
