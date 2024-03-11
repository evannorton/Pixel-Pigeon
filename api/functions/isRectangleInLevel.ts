import { Level } from "../types/World";
import { Rectangle } from "../types/Rectangle";
import { state } from "../state";

export interface IsRectangleInLevelOptions {
  levelID: string;
  rectangle: Rectangle;
}
export const isRectangleInLevel = (
  options: IsRectangleInLevelOptions,
): boolean => {
  if (state.values.world === null) {
    throw new Error(
      "An attempt was made to check if a position is in level before world was loaded.",
    );
  }
  const level: Level | null =
    state.values.world.levels.get(options.levelID) ?? null;
  if (level === null) {
    throw new Error(
      `An attempt was made to check if a position is in nonexistent level "${options.levelID}".`,
    );
  }
  return (
    options.rectangle.x >= 0 &&
    options.rectangle.y >= 0 &&
    options.rectangle.x + options.rectangle.width < level.width &&
    options.rectangle.y + options.rectangle.height < level.height
  );
};
