import { CollisionData } from "./types/CollisionData";
import {
  CreateAchievementOptions,
  createAchievement,
  unlockAchievement,
} from "./classes/Achievement";
import {
  CreateInputPressHandlerOptions,
  createInputPressHandler,
} from "./classes/InputPressHandler";
import {
  CreateInputTickHandlerOptions,
  InputTickHandlerGroup,
  createInputTickHandler,
} from "./classes/InputTickHandler";
import { CreateLabelOptions, createLabel, removeLabel } from "./classes/Label";
import {
  CreateQuadrilateralOptions,
  Quadrilateral,
  createQuadrilateral,
  removeQuadrilateral,
} from "./classes/Quadrilateral";
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
import { Newgrounds } from "./types/Newgrounds";
import { OverlapData } from "./types/OverlapData";
import { PathEntityOptions, pathEntity } from "./functions/pathEntity";
import {
  PlayAudioSourceOptions,
  playAudioSource,
  stopAudioSource,
} from "./classes/AudioSource";
import { Rectangle } from "./types/Rectangle";
import { SpawnEntityOptions, spawnEntity } from "./functions/spawnEntity";
import { State } from "./classes/State";
import { TextStyleAlign, TextStyleTextBaseline } from "pixi.js";
import { despawnEntity } from "./functions/despawnEntity";
import { getCurrentTime } from "./functions/getCurrentTime";
import { getEntityFieldValue } from "./functions/getEntityFieldValue";
import { getEntityPosition } from "./functions/getEntityPosition";
import { getInputTickHandlerGroupID } from "./functions/getInputTickHandlerGroupID";
import { goToLevel } from "./functions/goToLevel";
import { initialize } from "./functions/initialize";
import { isEntityPathing } from "./functions/isEntityPathing";
import { lockCameraToEntity } from "./functions/lockCameraToEntity";
import { onRun } from "./functions/onRun";
import { onTick } from "./functions/onTick";
import { setEntityLevel } from "./functions/setEntityLevel";
import { setEntityPosition } from "./functions/setEntityPosition";
import { setPauseMenuCondition } from "./functions/setPauseMenuCondition";
import { stopEntity } from "./functions/stopEntity";
import { takeScreenshot } from "./functions/takeScreenshot";

export {
  CollisionData,
  createAchievement,
  CreateAchievementOptions,
  createInputPressHandler,
  CreateInputPressHandlerOptions,
  createInputTickHandler,
  CreateInputTickHandlerOptions,
  createLabel,
  CreateLabelOptions,
  createQuadrilateral,
  CreateQuadrilateralOptions,
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
  getEntityFieldValue,
  getEntityPosition,
  getInputTickHandlerGroupID,
  goToLevel,
  initialize,
  InputTickHandlerGroup,
  isEntityPathing,
  KeyboardButton,
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
  Quadrilateral,
  Rectangle,
  removeLabel,
  removeQuadrilateral,
  removeSpriteInstance,
  setEntityLevel,
  setEntityPosition,
  setPauseMenuCondition,
  spawnEntity,
  SpawnEntityOptions,
  State,
  stopAudioSource,
  stopEntity,
  takeScreenshot,
  TextStyleAlign,
  TextStyleTextBaseline,
  unlockAchievement,
};
declare global {
  interface Window {
    newgrounds: Newgrounds | null;
  }
}
