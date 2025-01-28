import { Rectangle } from "../types/Rectangle";

export const rectanglesOverlap = (
  rectangle1: Rectangle,
  rectangle2: Rectangle,
): boolean => {
  if (Math.floor(rectangle1.x) + rectangle1.width <= Math.floor(rectangle2.x)) {
    return false;
  }
  if (
    Math.floor(rectangle1.y) + rectangle1.height <=
    Math.floor(rectangle2.y)
  ) {
    return false;
  }
  if (Math.floor(rectangle2.x) + rectangle2.width <= Math.floor(rectangle1.x)) {
    return false;
  }
  if (
    Math.floor(rectangle2.y) + rectangle2.height <=
    Math.floor(rectangle1.y)
  ) {
    return false;
  }
  return true;
};
