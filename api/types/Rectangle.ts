/**
 * Used internally for collisions and overlapping
 */
export interface Rectangle {
  /**
   * The height of the Rectangle
   */
  readonly height: number;
  /**
   * The width of the Rectangle
   */
  readonly width: number;
  /**
   * The X position of the Rectangle
   */
  readonly x: number;
  /**
   * The Y position of the Rectangle
   */
  readonly y: number;
}
