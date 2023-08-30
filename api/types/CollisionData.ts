import { EntityCollidable } from "pigeon-mode-game-framework/api/types/EntityCollidable";

export interface CollisionData<CollisionLayer extends string> {
  readonly entityCollidables: EntityCollidable<CollisionLayer>[];
  readonly map: boolean;
}
