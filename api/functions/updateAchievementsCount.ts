import { Achievement } from "../classes/Achievement";
import { getDefinables } from "definables";

export const updateAchievementsCount = (): void => {
  const achievementsAmountUnlockedElement: HTMLElement | null =
    document.getElementById("achievements-amount-unlocked");
  if (achievementsAmountUnlockedElement === null) {
    throw new Error(
      "An attempt was made to update achievements count with no achievements amount unlocked element in the DOM.",
    );
  }
  const achievementsAmountPercentElement: HTMLElement | null =
    document.getElementById("achievements-amount-percent");
  if (achievementsAmountPercentElement === null) {
    throw new Error(
      "An attempt was made to update achievements count with no achievements amount percent element in the DOM.",
    );
  }
  const unlockedAmount: number = Array.from(getDefinables(Achievement)).filter(
    ([, achievement]: [string, Achievement]): boolean =>
      achievement.isUnlocked(),
  ).length;
  const totalAmount: number = getDefinables(Achievement).size;
  let percent: number = Math.round((unlockedAmount / totalAmount) * 100);
  if (unlockedAmount > 0 && percent === 0) {
    percent = 1;
  }
  if (unlockedAmount < totalAmount && percent === 100) {
    percent = 99;
  }
  achievementsAmountUnlockedElement.innerText = unlockedAmount.toString();
  achievementsAmountPercentElement.innerText = `(${percent}%)`;
};
