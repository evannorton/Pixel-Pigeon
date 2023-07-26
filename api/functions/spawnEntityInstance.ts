import { Layer, Level } from "../types/World";
import { getToken } from "./getToken";
import { state } from "../state";

interface SpawnEntityInstanceOptions {
  readonly entityID: string;
  readonly height: number;
  readonly layerID: string;
  readonly onCollision?: () => void;
  readonly spriteInstanceID?: string;
  readonly width: number;
  readonly x: number;
  readonly y: number;
}

export const spawnEntityInstance = (
  spawnEntityOptions: SpawnEntityInstanceOptions,
): string => {
  if (state.values.world === null) {
    throw new Error(
      "An attempt was made to spawn an entity before world was loaded.",
    );
  }
  if (state.values.levelID === null) {
    throw new Error(
      "An attempt was made to spawn an entity with no active level.",
    );
  }
  const level: Level | null =
    state.values.world.levels.get(state.values.levelID) ?? null;
  if (level === null) {
    throw new Error(
      "An attempt was made to spawn an entity with a nonexistant active level.",
    );
  }
  const layer: Layer | null =
    level.layers.find(
      (levelLayer: Layer): boolean =>
        levelLayer.id === spawnEntityOptions.layerID,
    ) ?? null;
  if (layer === null) {
    throw new Error(
      "An attempt was made to spawn an entity with a nonexistant layer.",
    );
  }
  const id: string = getToken();
  layer.entityInstances.set(id, {
    entityID: spawnEntityOptions.entityID,
    height: spawnEntityOptions.height,
    isCollidable: true,
    onCollision: spawnEntityOptions.onCollision ?? null,
    spriteInstanceID: spawnEntityOptions.spriteInstanceID ?? null,
    width: spawnEntityOptions.width,
    x: spawnEntityOptions.x,
    xVelocity: 0,
    y: spawnEntityOptions.y,
    yVelocity: 0,
  });
  return id;
};
