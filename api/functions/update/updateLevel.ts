import { Entity } from "../../classes/Entity";
import { getDefinables } from "../getDefinables";

export const updateLevel = (): void => {
  for (const entity of getDefinables(Entity).values()) {
    entity.updateMovement();
  }
  for (const entity of getDefinables(Entity).values()) {
    entity.updatePathing();
  }
  for (const entity of getDefinables(Entity).values()) {
    entity.updateOverlap();
  }
};
