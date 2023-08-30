import { EntityCollidable } from "pigeon-mode-game-framework/api/types/EntityCollidable";

export interface OverlapData<CollisionLayer extends string> {
  readonly entityCollidables: EntityCollidable<CollisionLayer>[];
  readonly map: boolean;
}
