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
import {
  CreateVolumeChannelOptions,
  createVolumeChannel,
} from "./classes/VolumeChannel";
import { EntityCollidable } from "./types/EntityCollidable";
import { EntityPosition } from "./types/EntityPosition";
import { KeyboardButton } from "./types/KeyboardButton";
import { MoveEntityOptions, moveEntity } from "./functions/moveEntity";
import { OverlapData } from "./types/OverlapData";
import { PathEntityOptions, pathEntity } from "./functions/pathEntity";
import {
  PlayAudioSourceOptions,
  playAudioSource,
  stopAudioSource,
} from "./classes/AudioSource";
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
import { initialize } from "./functions/initialize";
import { isEntityPathing } from "./functions/isEntityPathing";
import { lockCameraToEntity } from "./functions/lockCameraToEntity";
import { onRun } from "./functions/onRun";
import { onTick } from "./functions/onTick";
import { setPauseMenuCondition } from "./functions/setPauseMenuCondition";
import { stopEntity } from "./functions/stopEntity";
import { takeScreenshot } from "./functions/takeScreenshot";

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
  createVolumeChannel,
  CreateVolumeChannelOptions,
  despawnEntity,
  EntityCollidable,
  EntityPosition,
  getCurrentTime,
  getEntityPosition,
  getInputTickHandlerGroupID,
  goToLevel,
  initialize,
  InputTickHandlerGroup,
  isEntityPathing,
  KeyboardButton as InputKey,
  lockCameraToEntity,
  moveEntity,
  MoveEntityOptions,
  onRun,
  onTick,
  OverlapData,
  pathEntity,
  PathEntityOptions,
  playAudioSource,
  PlayAudioSourceOptions,
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
  takeScreenshot,
};
