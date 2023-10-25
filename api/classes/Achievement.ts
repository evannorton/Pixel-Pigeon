import { Definable } from "./Definable";
import { getAchievementUnlockRenderStartTime } from "../functions/getAchievementUnlockRenderStartTime";
import { getDefinable } from "../functions/getDefinable";
import { state } from "../state";
import getStorageItem from "../functions/storage/getStorageItem";
import setStorageItem from "../functions/storage/setStorageItem";

export interface CreateAchievementOptions {
  description: string;
  id: string;
  imagePath: string;
  name: string;
}
export interface UnlockAchievementOptions {
  id: string;
}
export class Achievement extends Definable {
  private readonly _infoElement: HTMLDivElement;
  private readonly _options: CreateAchievementOptions;
  public constructor(options: CreateAchievementOptions) {
    super(options.id);
    this._options = options;
    const achievementsGridElement: HTMLElement | null =
      document.getElementById("achievements-grid");
    if (achievementsGridElement === null) {
      throw new Error(
        `An attempt was made to add Achievement "${this._id}" to the pause menu with no achievements grid element in the DOM.`,
      );
    }
    this._infoElement = document.createElement("div");
    this._infoElement.classList.add("achievement-info");
    // Image
    const iconElement: HTMLImageElement = document.createElement("img");
    iconElement.src = `./images/${this._options.imagePath}.png`;
    iconElement.classList.add("achievement-info-icon");
    this._infoElement.appendChild(iconElement);
    // Text
    const textElement: HTMLDivElement = document.createElement("div");
    textElement.classList.add("achievement-info-text");
    // Name
    const nameElement: HTMLSpanElement = document.createElement("span");
    nameElement.innerText = this._options.name;
    nameElement.classList.add("achievement-info-name");
    textElement.appendChild(nameElement);
    // Description
    const descriptionElement: HTMLSpanElement = document.createElement("span");
    descriptionElement.innerText = this._options.description;
    descriptionElement.classList.add("achievement-info-description");
    textElement.appendChild(descriptionElement);
    this._infoElement.appendChild(textElement);
    achievementsGridElement.appendChild(this._infoElement);
    this.updateInfoElements();
  }

  public unlock(): void {
    const noticesElement: HTMLElement | null = document.getElementById(
      "achievement-unlock-notices",
    );
    if (noticesElement === null) {
      throw new Error(
        `An attempt was made to unlock Achievement "${this._id}" with no achievement unlocks notices element in the DOM.`,
      );
    }
    if (getStorageItem(`achievement-${this._id}`) === null) {
      const startTime: number = getAchievementUnlockRenderStartTime();
      state.setValues({ achievementUnlockRenderedAt: startTime });
      setTimeout((): void => {
        const noticeElement: HTMLDivElement = document.createElement("div");
        noticeElement.classList.add("achievement-unlock-notice");
        // Image
        const iconElement: HTMLImageElement = document.createElement("img");
        iconElement.src = `./images/${this._options.imagePath}.png`;
        iconElement.classList.add("achievement-unlock-notice-icon");
        noticeElement.appendChild(iconElement);
        // Text
        const textElement: HTMLDivElement = document.createElement("div");
        textElement.classList.add("achievement-unlock-notice-text");
        // Heading
        const headingElement: HTMLSpanElement = document.createElement("span");
        headingElement.innerText = "Achievement unlocked";
        headingElement.classList.add("achievement-unlock-notice-heading");
        textElement.appendChild(headingElement);
        // Name
        const nameElement: HTMLSpanElement = document.createElement("span");
        nameElement.innerText = this._options.name;
        nameElement.classList.add("achievement-unlock-notice-name");
        textElement.appendChild(nameElement);
        noticeElement.appendChild(textElement);
        noticesElement.appendChild(noticeElement);
        // Timing
        setTimeout((): void => {
          noticeElement.classList.add("fading-in");
        }, 100);
        setTimeout((): void => {
          noticeElement.classList.add("fading-out");
        }, 4000);
        setTimeout((): void => {
          noticeElement.remove();
        }, 6000);
      }, startTime - state.values.currentTime);
    }
    setStorageItem(`achievement-${this._id}`, Date.now());
    this.updateInfoElements();
  }

  public updateInfoElements(): void {
    const unlockedAt: unknown = getStorageItem(`achievement-${this._id}`);
    if (typeof unlockedAt !== "number" && unlockedAt !== null) {
      throw new Error(
        `An attempt was made to update Achievement "${this._id}" info elements with an invalid unlocked at value.`,
      );
    }
    const achievementInfoElements: NodeListOf<HTMLElement> =
      document.querySelectorAll(".achievement-info");
    for (const achievementInfoElement of achievementInfoElements) {
      if (achievementInfoElement === this._infoElement) {
        if (unlockedAt !== null) {
          achievementInfoElement.classList.add("unlocked");
        } else {
          achievementInfoElement.classList.remove("unlocked");
        }
      }
    }
  }
}
export const createAchievement = (options: CreateAchievementOptions): string =>
  new Achievement(options).id;
export const unlockAchievement = (achievmentID: string): void => {
  getDefinable<Achievement>(Achievement, achievmentID).unlock();
};
