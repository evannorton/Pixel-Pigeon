import {
  WorldLevel,
  WorldLevelLayer,
} from "pigeon-mode-game-library/api/types/World";
import getToken from "pigeon-mode-game-library/api/functions/getToken";
import state from "pigeon-mode-game-library/api/state";

interface SpawnEntityInstanceOptions {
  readonly entityID: string;
  readonly height: number;
  readonly layerID: string;
  readonly spriteInstanceID?: string;
  readonly width: number;
  readonly x: number;
  readonly y: number;
}
const spawnEntityInstance = (
  spawnEntityOptions: SpawnEntityInstanceOptions
): string => {
  if (state.values.world === null) {
    throw new Error(
      "An attempt was made to spawn an entity before world was loaded."
    );
  }
  if (state.values.levelID === null) {
    throw new Error(
      "An attempt was made to spawn an entity with no active level."
    );
  }
  const level: WorldLevel | null =
    state.values.world.levels.get(state.values.levelID) ?? null;
  if (level === null) {
    throw new Error(
      "An attempt was made to spawn an entity with a nonexistant active level."
    );
  }
  const layer: WorldLevelLayer | null =
    level.layers.find(
      (levelLayer: WorldLevelLayer): boolean =>
        levelLayer.id === spawnEntityOptions.layerID
    ) ?? null;
  if (layer === null) {
    throw new Error(
      "An attempt was made to spawn an entity with a nonexistant layer."
    );
  }
  const id: string = getToken();
  layer.entityInstances.push({
    entityID: spawnEntityOptions.entityID,
    height: spawnEntityOptions.height,
    id,
    spriteInstanceID: spawnEntityOptions.spriteInstanceID ?? null,
    width: spawnEntityOptions.width,
    x: spawnEntityOptions.x,
    xVelocity: 0,
    y: spawnEntityOptions.y,
    yVelocity: 0,
  });
  return id;
};

export default spawnEntityInstance;
