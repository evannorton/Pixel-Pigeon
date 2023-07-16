import SpriteInstance from "pigeon-mode-game-library/api/classes/SpriteInstance";
import getDefinable from "pigeon-mode-game-library/api/functions/getDefinable";

interface PlaySpriteAnimationOptions<AnimationID extends string> {
  readonly animationID: AnimationID;
  readonly spriteInstanceID: string;
}
const playSpriteInstanceAnimation = <AnimationID extends string>(
  options: PlaySpriteAnimationOptions<AnimationID>
): void => {
  const sprite: SpriteInstance<AnimationID> = getDefinable<
    SpriteInstance<AnimationID>
  >(SpriteInstance, options.spriteInstanceID);
  sprite.playAnimation(options.animationID);
};

export default playSpriteInstanceAnimation;
