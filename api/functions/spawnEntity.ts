import { CollisionData } from "../types/CollisionData";
import { Layer, Level } from "../types/World";
import { getToken } from "./getToken";
import { state } from "../state";

interface SpawnEntityOptions<CollisionLayer extends string> {
  readonly collidableLayers?: CollisionLayer[];
  readonly collisionLayers?: CollisionLayer[];
  readonly height: number;
  readonly layerID: string;
  readonly onCollision?: (data: CollisionData) => void;
  readonly spriteInstanceID?: string;
  readonly width: number;
  readonly x: number;
  readonly y: number;
  readonly zIndex: number;
}

export const spawnEntity = <CollisionLayer extends string>(
  spawnEntityOptions: SpawnEntityOptions<CollisionLayer>,
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
  layer.entities.set(id, {
    collidableLayers: spawnEntityOptions.collidableLayers ?? [],
    collisionLayers: spawnEntityOptions.collisionLayers ?? [],
    height: spawnEntityOptions.height,
    id,
    isCollidable: true,
    onCollision: spawnEntityOptions.onCollision ?? null,
    spriteInstanceID: spawnEntityOptions.spriteInstanceID ?? null,
    width: spawnEntityOptions.width,
    x: spawnEntityOptions.x,
    xVelocity: 0,
    y: spawnEntityOptions.y,
    yVelocity: 0,
    zIndex: spawnEntityOptions.zIndex,
  });
  return id;
};
