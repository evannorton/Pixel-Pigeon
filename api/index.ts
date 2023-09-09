import { CollisionData } from "./types/CollisionData";
import {
  CreateInputPressHandlerOptions,
  createInputPressHandler,
} from "./classes/InputPressHandler";
import {
  CreateInputTickHandlerOptions,
  InputTickHandlerGroup,
  createInputTickHandler,
} from "./classes/InputTickHandler";
import {
  CreateSpriteInstanceOptions,
  createSpriteInstance,
  removeSpriteInstance,
} from "./classes/SpriteInstance";
import {
  CreateSpriteOptions,
  CreateSpriteOptionsAnimation,
  CreateSpriteOptionsAnimationFrame,
  createSprite,
} from "./classes/Sprite";
import { EntityCollidable } from "./types/EntityCollidable";
import { EntityPosition } from "./types/EntityPosition";
import { InputKey } from "./types/InputKey";
import { MoveEntityOptions, moveEntity } from "./functions/moveEntity";
import { OverlapData } from "./types/OverlapData";
import { PathEntityOptions, pathEntity } from "./functions/pathEntity";
import { Rectangle } from "./types/Rectangle";
import {
  SetEntityPositionOptions,
  setEntityPosition,
} from "./functions/setEntityPosition";
import { SpawnEntityOptions, spawnEntity } from "./functions/spawnEntity";
import { State } from "./classes/State";
import { despawnEntity } from "./functions/despawnEntity";
import { getCurrentTime } from "./functions/getCurrentTime";
import { getEntityPosition } from "./functions/getEntityPosition";
import { getInputTickHandlerGroupID } from "./functions/getInputTickHandlerGroupID";
import { goToLevel } from "./functions/goToLevel";
import { init } from "./functions/init";
import { lockCameraToEntity } from "./functions/lockCameraToEntity";
import { onTick } from "./functions/onTick";
import { playAudioSource, stopAudioSource } from "./classes/AudioSource";
import { setPauseMenuCondition } from "./functions/setPauseMenuCondition";
import { stopEntity } from "./functions/stopEntity";

export {
  CollisionData,
  createInputPressHandler,
  CreateInputPressHandlerOptions,
  createInputTickHandler,
  CreateInputTickHandlerOptions,
  createSprite,
  createSpriteInstance,
  CreateSpriteInstanceOptions,
  CreateSpriteOptions,
  CreateSpriteOptionsAnimation,
  CreateSpriteOptionsAnimationFrame,
  despawnEntity,
  EntityCollidable,
  EntityPosition,
  getCurrentTime,
  getEntityPosition,
  getInputTickHandlerGroupID,
  goToLevel,
  init,
  InputKey,
  InputTickHandlerGroup,
  lockCameraToEntity,
  moveEntity,
  MoveEntityOptions,
  onTick,
  OverlapData,
  PathEntityOptions,
  pathEntity,
  playAudioSource,
  Rectangle,
  removeSpriteInstance,
  setEntityPosition,
  SetEntityPositionOptions,
  setPauseMenuCondition,
  spawnEntity,
  SpawnEntityOptions,
  State,
  stopAudioSource,
  stopEntity,
};
