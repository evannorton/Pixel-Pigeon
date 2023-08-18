import { EntityCollidable } from "./EntityCollidable";

export interface CollisionData {
  readonly entityCollidables: EntityCollidable[];
  readonly map: boolean;
}
