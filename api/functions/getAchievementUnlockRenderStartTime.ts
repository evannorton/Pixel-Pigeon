import { state } from "../state";

export const getAchievementUnlockRenderStartTime = (): number => {
  if (
    state.values.achievementUnlockRenderedAt !== null &&
    state.values.achievementUnlockRenderedAt + 6000 > state.values.currentTime
  ) {
    return state.values.achievementUnlockRenderedAt + 6000;
  }
  return state.values.currentTime;
};
