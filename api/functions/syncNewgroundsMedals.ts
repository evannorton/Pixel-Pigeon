import { Achievement } from "../classes/Achievement";
import { NewgroundsMedal } from "../types/Newgrounds";
import { StorageAchievement } from "../types/Storage";
import { getDefinable } from "./getDefinable";
import { getDefinables } from "./getDefinables";
import { getStorageItem } from "./storage/getStorageItem";
import { setStorageItem } from "./storage/setStorageItem";
import { updateAchievementsCount } from "./updateAchievementsCount";

export const syncNewgroundsMedals = (): void => {
  const storageAchievements: StorageAchievement[] =
    (getStorageItem("achievements") as StorageAchievement[] | null) ?? [];
  if (window.newgrounds !== null && window.newgrounds.session_id !== null) {
    window.newgrounds.queueComponent(
      "Medal.getList",
      {},
      (result: unknown): void => {
        if (window.newgrounds === null) {
          throw new Error(
            "Attempted to handle medal list with no newgrounds object.",
          );
        }
        const medals: NewgroundsMedal[] =
          (
            result as {
              medals?: NewgroundsMedal[];
            }
          ).medals ?? [];
        for (const medal of medals) {
          if (medal.unlocked) {
            const matchedStorageAchievement: StorageAchievement | null =
              storageAchievements.find(
                (storageAchievement: StorageAchievement): boolean =>
                  getDefinable(Achievement, storageAchievement.id)
                    .newgroundsMedalID === medal.id,
              ) ?? null;
            if (
              matchedStorageAchievement !== null &&
              matchedStorageAchievement.unlockedAt === null
            ) {
              matchedStorageAchievement.unlockedAt = Date.now();
            }
          }
        }
        for (const storageAchievement of storageAchievements) {
          if (storageAchievement.unlockedAt !== null) {
            const matchedMedal: NewgroundsMedal | null =
              medals.find(
                (medal: NewgroundsMedal): boolean =>
                  getDefinable(Achievement, storageAchievement.id)
                    .newgroundsMedalID === medal.id,
              ) ?? null;
            if (matchedMedal !== null && !matchedMedal.unlocked) {
              window.newgrounds.callComponent("Medal.unlock", {
                id: matchedMedal.id,
              });
            }
          }
        }
        setStorageItem("achievements", storageAchievements);
        getDefinables(Achievement).forEach((achievement: Achievement): void => {
          achievement.updateInfoElements();
        });
        updateAchievementsCount();
      },
    );
    window.newgrounds.executeQueue();
  }
};
