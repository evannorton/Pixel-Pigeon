import { PixelScatter } from "../../types/PixelScatter";
import { state } from "../../state";
import { stopPixelScatter } from "../pixelScatter/stopPixelScatter";

export const updatePixelScatter = (): void => {
  const scatter: PixelScatter | null = state.values.pixelScatter;
  if (scatter !== null) {
    if (scatter.startedAt !== null && scatter.duration !== null) {
      const currentTime: number = state.values.currentTime;
      const elapsedMilliseconds: number = currentTime - scatter.startedAt;
      let isComplete: boolean = false;
      if (scatter.duration <= 0) {
        isComplete = true;
      } else {
        if (elapsedMilliseconds >= scatter.duration) {
          isComplete = true;
        }
      }
      if (isComplete) {
        stopPixelScatter();
      }
    }
  }
};
