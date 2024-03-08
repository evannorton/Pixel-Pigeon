import { RGB } from "../types/RGB";

export const getHexFromRGB = (rgb: RGB): string =>
  `#${rgb.r.toString(16).padStart(2, "0")}${rgb.g
    .toString(16)
    .padStart(2, "0")}${rgb.b.toString(16).padStart(2, "0")}`;
