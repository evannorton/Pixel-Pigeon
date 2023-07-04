import Sprite from "../classes/Sprite";
import getDefinable from "./getDefinable";

const playSpriteAnimation = <AnimationID extends string>(
  spriteImagePath: string,
  animationID: AnimationID
): void => {
  const sprite: Sprite<AnimationID> = getDefinable<Sprite<AnimationID>>(
    Sprite,
    spriteImagePath
  );
  sprite.playAnimation(animationID);
};

export default playSpriteAnimation;
