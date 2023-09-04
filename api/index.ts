import { CollisionData } from "pigeon-mode-game-framework/api/types/CollisionData";
import {
  CreateInputPressHandlerOptions,
  createInputPressHandler,
} from "pigeon-mode-game-framework/api/classes/InputPressHandler";
import {
  CreateInputTickHandlerOptions,
  InputTickHandlerGroup,
  createInputTickHandler,
} from "pigeon-mode-game-framework/api/classes/InputTickHandler";
import {
  CreateSpriteInstanceOptions,
  createSpriteInstance,
  removeSpriteInstance,
} from "pigeon-mode-game-framework/api/classes/SpriteInstance";
import {
  CreateSpriteOptions,
  CreateSpriteOptionsAnimation,
  CreateSpriteOptionsAnimationFrame,
  createSprite,
} from "pigeon-mode-game-framework/api/classes/Sprite";
import { EntityCollidable } from "pigeon-mode-game-framework/api/types/EntityCollidable";
import { EntityPosition } from "pigeon-mode-game-framework/api/types/EntityPosition";
import {
  MoveEntityOptions,
  moveEntity,
} from "pigeon-mode-game-framework/api/functions/moveEntity";
import { OverlapData } from "pigeon-mode-game-framework/api/types/OverlapData";
import { Rectangle } from "pigeon-mode-game-framework/api/types/Rectangle";
import {
  SetEntityPositionOptions,
  setEntityPosition,
} from "pigeon-mode-game-framework/api/functions/setEntityPosition";
import {
  SpawnEntityOptions,
  spawnEntity,
} from "pigeon-mode-game-framework/api/functions/spawnEntity";
import { State } from "pigeon-mode-game-framework/api/classes/State";
import {
  StopEntityOptions,
  stopEntity,
} from "pigeon-mode-game-framework/api/functions/stopEntity";
import { despawnEntity } from "pigeon-mode-game-framework/api/functions/despawnEntity";
import { getCurrentTime } from "pigeon-mode-game-framework/api/functions/getCurrentTime";
import { getEntityPosition } from "pigeon-mode-game-framework/api/functions/getEntityPosition";
import { getInputTickHandlerGroupID } from "pigeon-mode-game-framework/api/functions/getInputTickHandlerGroupID";
import { goToLevel } from "pigeon-mode-game-framework/api/functions/goToLevel";
import { init } from "pigeon-mode-game-framework/api/functions/init";
import { lockCameraToEntity } from "pigeon-mode-game-framework/api/functions/lockCameraToEntity";
import { onTick } from "pigeon-mode-game-framework/api/functions/onTick";
import {
  playAudioSource,
  stopAudioSource,
} from "pigeon-mode-game-framework/api/classes/AudioSource";
import { setPauseMenuCondition } from "pigeon-mode-game-framework/api/functions/setPauseMenuCondition";

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
  InputTickHandlerGroup,
  lockCameraToEntity,
  moveEntity,
  MoveEntityOptions,
  onTick,
  OverlapData,
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
  StopEntityOptions,
};
