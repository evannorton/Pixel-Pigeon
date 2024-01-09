import { AudioSource } from "../classes/AudioSource";
import { ImageSource } from "../classes/ImageSource";
import { getDefinables } from "./getDefinables";

export const getTotalAssets = (): number =>
  // Audio sources
  getDefinables(AudioSource).size +
  // Image sources
  getDefinables(ImageSource).size +
  // Volume test sound
  1 +
  // RetroPixels font
  1;
