import { Collidable } from "../types/Collidable";

export interface EntityCollidable {
  readonly collidable: Collidable<string>;
  readonly entityID: string;
}
