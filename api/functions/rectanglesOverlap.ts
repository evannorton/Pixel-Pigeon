import { Rectangle } from "../types/Rectangle";

export const rectanglesOverlap = (
  rectangle1: Rectangle,
  rectangle2: Rectangle,
): boolean => {
  if (rectangle1.x + rectangle1.width <= rectangle2.x) {
    return false;
  }
  if (rectangle1.y + rectangle1.height <= rectangle2.y) {
    return false;
  }
  if (rectangle2.x + rectangle2.width <= rectangle1.x) {
    return false;
  }
  if (rectangle2.y + rectangle2.height <= rectangle1.y) {
    return false;
  }
  return true;
};
