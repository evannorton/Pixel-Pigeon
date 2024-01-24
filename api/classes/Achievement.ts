import { Definable } from "./Definable";
import { StorageAchievement } from "../types/Storage";
import { getAchievementUnlockRenderStartTime } from "../functions/getAchievementUnlockRenderStartTime";
import { getDefinable } from "../functions/getDefinable";
import { getStorageItem } from "../functions/storage/getStorageItem";
import { setStorageItem } from "../functions/storage/setStorageItem";
import { state } from "../state";

export interface CreateAchievementOptions {
  description: string;
  id: string;
  imagePath: string;
  name: string;
  newgroundsMedalID?: number;
  isSecret?: boolean;
}
export interface UnlockAchievementOptions {
  id: string;
}
export class Achievement extends Definable {
  private readonly _infoDescriptionElement: HTMLSpanElement;
  private readonly _infoElement: HTMLDivElement;
  private readonly _infoIconElement: HTMLImageElement;
  private readonly _infoNameElement: HTMLSpanElement;
  private readonly _infoTextElement: HTMLDivElement;
  private readonly _options: CreateAchievementOptions;
  public constructor(options: CreateAchievementOptions) {
    if (state.values.isInitialized) {
      throw new Error(
        `Attempted to create achievement ${options.id} after initialization.`,
      );
    }
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
    // Icon
    this._infoIconElement = document.createElement("img");
    this._infoIconElement.classList.add("achievement-info-icon");
    this._infoElement.appendChild(this._infoIconElement);
    // Text
    this._infoTextElement = document.createElement("div");
    this._infoTextElement.classList.add("achievement-info-text");
    // Name
    this._infoNameElement = document.createElement("span");
    this._infoNameElement.classList.add("achievement-info-name");
    this._infoTextElement.appendChild(this._infoNameElement);
    // Description
    this._infoDescriptionElement = document.createElement("span");
    this._infoDescriptionElement.classList.add("achievement-info-description");
    this._infoTextElement.appendChild(this._infoDescriptionElement);
    this._infoElement.appendChild(this._infoTextElement);
    achievementsGridElement.appendChild(this._infoElement);
  }

  public get newgroundsMedalID(): number | null {
    return this._options.newgroundsMedalID ?? null;
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
    const storageAchievements: StorageAchievement[] =
      (getStorageItem("achievements") as StorageAchievement[] | null) ?? [];
    const matchedStorageAchievement: StorageAchievement | null =
      storageAchievements.find(
        (storageAchievement: StorageAchievement): boolean =>
          storageAchievement.id === this._id,
      ) ?? null;
    if (matchedStorageAchievement === null) {
      throw new Error(
        `An attempt was made to update Achievement "${this._id}" info elements with the achievement missing from storage.`,
      );
    }
    if (matchedStorageAchievement.unlockedAt === null) {
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
    setStorageItem(
      "achievements",
      storageAchievements.map(
        (storageAchievement: StorageAchievement): StorageAchievement =>
          storageAchievement.id === this._id
            ? {
                ...storageAchievement,
                unlockedAt: Date.now(),
              }
            : storageAchievement,
      ),
    );
    this.updateInfoElements();
    if (typeof this._options.newgroundsMedalID !== "undefined") {
      if (window.newgrounds !== null && window.newgrounds.session_id !== null) {
        window.newgrounds.callComponent("Medal.unlock", {
          id: this._options.newgroundsMedalID,
        });
      }
    }
  }

  public addToStorage(): void {
    const storageAchievements: StorageAchievement[] =
      (getStorageItem("achievements") as StorageAchievement[] | null) ?? [];
    if (
      storageAchievements.every(
        (achievementStorage: StorageAchievement): boolean =>
          achievementStorage.id !== this._id,
      )
    ) {
      storageAchievements.push({
        id: this._id,
        unlockedAt: null,
      });
      setStorageItem("achievements", storageAchievements);
    }
  }

  public updateInfoElements(): void {
    const storageAchievements: StorageAchievement[] =
      (getStorageItem("achievements") as StorageAchievement[] | null) ?? [];
    const matchedStorageAchievement: StorageAchievement | null =
      storageAchievements.find(
        (storageAchievement: StorageAchievement): boolean =>
          storageAchievement.id === this._id,
      ) ?? null;
    if (matchedStorageAchievement === null) {
      throw new Error(
        `An attempt was made to update Achievement "${this._id}" info elements with the achievement missing from storage.`,
      );
    }
    const achievementInfoElements: NodeListOf<HTMLElement> =
      document.querySelectorAll(".achievement-info");
    for (const achievementInfoElement of achievementInfoElements) {
      if (achievementInfoElement === this._infoElement) {
        if (matchedStorageAchievement.unlockedAt !== null) {
          achievementInfoElement.classList.add("unlocked");
        } else {
          achievementInfoElement.classList.remove("unlocked");
        }
        if (
          matchedStorageAchievement.unlockedAt === null &&
          this._options.isSecret === true
        ) {
          this._infoIconElement.classList.add("secret");
          this._infoIconElement.src = "./svg/lock.svg";
          this._infoNameElement.innerText = "Secret Achievement";
          this._infoDescriptionElement.innerText =
            "Unlock this achievement to see its details.";
        } else {
          this._infoIconElement.classList.remove("secret");
          this._infoIconElement.src = `./images/${this._options.imagePath}.png`;
          this._infoNameElement.innerText = this._options.name;
          this._infoDescriptionElement.innerText = this._options.description;
        }
      }
    }
  }
}
export const createAchievement = (options: CreateAchievementOptions): string =>
  new Achievement(options).id;
export const unlockAchievement = (achievementID: string): void => {
  getDefinable<Achievement>(Achievement, achievementID).unlock();
};
