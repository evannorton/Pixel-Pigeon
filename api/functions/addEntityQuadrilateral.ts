import { EntityQuadrilateral } from "../types/World";
import { state } from "../state";

export const addEntityQuadrilateral = (
  entityID: string,
  entityQuadrilateral: EntityQuadrilateral,
): void => {
  if (state.values.world === null) {
    throw new Error(
      `An attempt was made to add entity "${entityID}" quadrilateral before world was loaded.`,
    );
  }
  for (const level of state.values.world.levels.values()) {
    for (const layer of level.layers) {
      for (const [layerEntityID, entity] of layer.entities) {
        if (layerEntityID === entityID) {
          entity.quadrilaterals.push(entityQuadrilateral);
        }
      }
    }
  }
};
