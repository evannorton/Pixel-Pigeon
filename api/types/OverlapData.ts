import { EntityCollidable } from "./EntityCollidable";

export interface OverlapData<CollisionLayer extends string> {
  readonly entityCollidables: EntityCollidable<CollisionLayer>[];
  readonly map: boolean;
}
