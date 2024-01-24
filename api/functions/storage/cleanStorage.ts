import { Achievement } from "../../classes/Achievement";
import { StorageAchievement } from "../../types/Storage";
import { getDefinables } from "../getDefinables";
import { getStorageItem } from "./getStorageItem";
import { setStorageItem } from "./setStorageItem";
import { state } from "../../state";

export const cleanStorage = (): void => {
  for (const key in { ...localStorage }) {
    const pieces: string[] = key.split("-");
    if (pieces[0] === "pp" && pieces[1] !== state.values.gameID) {
      localStorage.removeItem(key);
    }
  }
  const storageAchievements: StorageAchievement[] =
    (getStorageItem("achievements") as StorageAchievement[] | null) ?? [];
  const newStorageAchievements: StorageAchievement[] =
    storageAchievements.filter(
      (storageAchievement: StorageAchievement): boolean =>
        Array.from(getDefinables(Achievement)).some(
          ([, achievement]: [string, Achievement]): boolean =>
            achievement.id === storageAchievement.id,
        ),
    );
  setStorageItem("achievements", newStorageAchievements);
};
