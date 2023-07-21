import { SpriteInstance } from "../classes/SpriteInstance";
import { getDefinable } from "../functions/getDefinable";

interface PlaySpriteAnimationOptions<AnimationID extends string> {
  readonly animationID: AnimationID;
}

export const playSpriteInstanceAnimation = <AnimationID extends string>(
  spriteInstanceID: string,
  options: PlaySpriteAnimationOptions<AnimationID>,
): void => {
  const sprite: SpriteInstance<AnimationID> = getDefinable<
    SpriteInstance<AnimationID>
  >(SpriteInstance, spriteInstanceID);
  sprite.playAnimation(options.animationID);
};
