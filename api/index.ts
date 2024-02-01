import {
  Anchor,
  CreateAnchorOptions,
  createAnchor,
  removeAnchor,
} from "./classes/Anchor";
import { CollisionData } from "./types/CollisionData";
import {
  CreateAchievementOptions,
  createAchievement,
  unlockAchievement,
} from "./classes/Achievement";
import { CreateEntityOptions, createEntity } from "./functions/createEntity";
import {
  CreateInputPressHandlerOptions,
  createInputPressHandler,
} from "./classes/InputPressHandler";
import {
  CreateInputTickHandlerOptions,
  CreateInputTickHandlerOptionsGroup,
  createInputTickHandler,
} from "./classes/InputTickHandler";
import { CreateLabelOptions, createLabel, removeLabel } from "./classes/Label";
import {
  CreateQuadrilateralOptions,
  createQuadrilateral,
  removeQuadrilateral,
} from "./classes/Quadrilateral";
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
import {
  EntityCollidable,
  EntityPosition,
  EntityQuadrilateral,
  EntitySprite,
} from "./types/World";
import {
  GetEntityCalculatedPathOptions,
  getEntityCalculatedPath,
} from "./functions/getEntityCalculatedPath";
import { GetEntityIDsOptions, getEntityIDs } from "./functions/getEntityIDs";
import { MoveEntityOptions, moveEntity } from "./functions/moveEntity";
import { Newgrounds } from "./types/Newgrounds";
import { OverlapData } from "./types/OverlapData";
import { PathEntityOptions, pathEntity } from "./functions/pathEntity";
import { PathingEntityExclusion } from "./types/PathingEntityExclusion";
import {
  PlayAudioSourceOptions,
  playAudioSource,
  stopAudioSource,
} from "./classes/AudioSource";
import { Rectangle } from "./types/Rectangle";
import { State } from "./classes/State";
import { TextStyleAlign } from "pixi.js";
import { addEntityQuadrilateral } from "./functions/addEntityQuadrilateral";
import { addEntitySprite } from "./functions/addEntitySprite";
import { getActiveLevelID } from "./functions/getActiveLevelID";
import { getCurrentTime } from "./functions/getCurrentTime";
import { getEntityFieldValue } from "./functions/getEntityFieldValue";
import { getEntityLevelID } from "./functions/getEntityLevelID";
import { getEntityPosition } from "./functions/getEntityPosition";
import { getInputTickHandlerGroupID } from "./functions/getInputTickHandlerGroupID";
import { getRectangleCollisionData } from "./functions/getRectangleCollisionData";
import { goToLevel } from "./functions/goToLevel";
import { initialize } from "./functions/initialize";
import { isEntityPathing } from "./functions/isEntityPathing";
import { lockCameraToEntity } from "./functions/lockCameraToEntity";
import { onRun } from "./functions/onRun";
import { onTick } from "./functions/onTick";
import { removeEntity } from "./functions/removeEntity";
import { removeEntitySprite } from "./functions/removeEntitySprite";
import { setEntityBlockingPosition } from "./functions/setEntityBlockingPosition";
import { setEntityLevel } from "./functions/setEntityLevel";
import { setEntityPosition } from "./functions/setEntityPosition";
import { setEntityZIndex } from "./functions/setEntityZIndex";
import { setPauseMenuCondition } from "./functions/setPauseMenuCondition";
import { stopEntity } from "./functions/stopEntity";
import { takeScreenshot } from "./functions/takeScreenshot";

export {
  addEntityQuadrilateral,
  addEntitySprite,
  Anchor,
  CollisionData,
  createAchievement,
  CreateAchievementOptions,
  createAnchor,
  CreateAnchorOptions,
  createEntity,
  CreateEntityOptions,
  createInputPressHandler,
  CreateInputPressHandlerOptions,
  createInputTickHandler,
  CreateInputTickHandlerOptions,
  createLabel,
  CreateLabelOptions,
  createQuadrilateral,
  CreateQuadrilateralOptions,
  createSprite,
  CreateSpriteOptions,
  CreateSpriteOptionsAnimation,
  CreateSpriteOptionsAnimationFrame,
  createVolumeChannel,
  CreateVolumeChannelOptions,
  EntityCollidable,
  EntityPosition,
  EntityQuadrilateral,
  EntitySprite,
  getActiveLevelID,
  getCurrentTime,
  getEntityCalculatedPath,
  GetEntityCalculatedPathOptions,
  getEntityFieldValue,
  getEntityIDs,
  GetEntityIDsOptions,
  getEntityLevelID,
  getEntityPosition,
  getInputTickHandlerGroupID,
  getRectangleCollisionData,
  goToLevel,
  initialize,
  CreateInputTickHandlerOptionsGroup as InputTickHandlerGroup,
  isEntityPathing,
  lockCameraToEntity,
  moveEntity,
  MoveEntityOptions,
  onRun,
  onTick,
  OverlapData,
  pathEntity,
  PathEntityOptions,
  PathingEntityExclusion,
  playAudioSource,
  PlayAudioSourceOptions,
  Rectangle,
  removeAnchor,
  removeEntity,
  removeEntitySprite,
  removeLabel,
  removeQuadrilateral,
  setEntityBlockingPosition,
  setEntityLevel,
  setEntityPosition,
  setEntityZIndex,
  setPauseMenuCondition,
  State,
  stopAudioSource,
  stopEntity,
  takeScreenshot,
  TextStyleAlign,
  unlockAchievement,
};
declare global {
  interface Window {
    newgrounds: Newgrounds | null;
  }
}
