import { Ellipse } from "../classes/Ellipse";
import { EntityEllipse } from "../types/World";
import { getDefinable } from "./getDefinable";
import { state } from "../state";

export const addEntityEllipse = (
  entityID: string,
  entityEllipse: EntityEllipse,
): void => {
  if (state.values.world === null) {
    throw new Error(
      `An attempt was made to add entity "${entityID}" ellipse before world was loaded.`,
    );
  }
  for (const level of state.values.world.levels.values()) {
    for (const layer of level.layers) {
      for (const [layerEntityID, entity] of layer.entities) {
        if (layerEntityID === entityID) {
          entity.ellipses.push(entityEllipse);
          const ellipse: Ellipse = getDefinable(
            Ellipse,
            entityEllipse.ellipseID,
          );
          ellipse.entityID = entity.id;
        }
      }
    }
  }
};
