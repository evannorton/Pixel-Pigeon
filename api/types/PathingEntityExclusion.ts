import { EntityPosition } from "./World";

export interface PathingEntityExclusion {
  collisionLayer: string;
  entityPosition: EntityPosition;
}
