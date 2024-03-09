import { RGB } from "../types/RGB";

export const getRGBFromHex = (hex: string): RGB => ({
  b: parseInt(hex.slice(5, 7), 16),
  g: parseInt(hex.slice(3, 5), 16),
  r: parseInt(hex.slice(1, 3), 16),
});
