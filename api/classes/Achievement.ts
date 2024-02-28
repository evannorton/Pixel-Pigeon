import { Definable } from "./Definable";
import { StorageAchievement } from "../types/Storage";
import { getAchievementUnlockRenderStartTime } from "../functions/getAchievementUnlockRenderStartTime";
import { getDefinable } from "../functions/getDefinable";
import { getStorageItem } from "../functions/storage/getStorageItem";
import { newgrounds } from "../newgrounds";
import { setStorageItem } from "../functions/storage/setStorageItem";
import { state } from "../state";
import { updateAchievementsCount } from "../functions/updateAchievementsCount";

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
  private readonly _description: string;
  private readonly _imagePath: string;
  private readonly _infoDescriptionElement: HTMLSpanElement;
  private readonly _infoElement: HTMLDivElement;
  private readonly _infoIconElement: HTMLImageElement;
  private readonly _infoNameElement: HTMLSpanElement;
  private readonly _infoTextElement: HTMLDivElement;
  private readonly _isSecret: boolean = false;
  private readonly _name: string;
  private readonly _newgroundsMedalID: number | null;
  public constructor(options: CreateAchievementOptions) {
    super(options.id);
    if (state.values.isInitialized) {
      throw new Error(
        `Attempted to create Achievement "${this._id}" after initialization.`,
      );
    }
    const achievementsGridElement: HTMLElement | null =
      document.getElementById("achievements-grid");
    if (achievementsGridElement === null) {
      throw new Error(
        `An attempt was made to add Achievement "${this._id}" to the pause menu with no achievements grid element in the DOM.`,
      );
    }
    this._description = options.description;
    this._imagePath = options.imagePath;
    this._name = options.name;
    this._newgroundsMedalID = options.newgroundsMedalID ?? null;
    // Info
    this._infoElement = document.createElement("div");
    this._infoElement.classList.add("achievement-info");
    // Icon
    this._infoIconElement = document.createElement("img");
    this._infoIconElement.classList.add("achievement-info-icon");
    this._infoIconElement.draggable = false;
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
    return this._newgroundsMedalID ?? null;
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
        iconElement.src = `./images/${this._imagePath}.png`;
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
        nameElement.innerText = this._name;
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
    if (this._newgroundsMedalID !== null) {
      if (newgrounds !== null && newgrounds.session_id !== null) {
        newgrounds.callComponent("Medal.unlock", {
          id: this._newgroundsMedalID,
        });
      }
    }
    updateAchievementsCount();
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

  public isUnlocked(): boolean {
    return this.getStorageAchievement().unlockedAt !== null;
  }

  public updateInfoElements(): void {
    const storageAchievement: StorageAchievement = this.getStorageAchievement();
    if (storageAchievement.unlockedAt !== null) {
      this._infoElement.classList.add("unlocked");
    } else {
      this._infoElement.classList.remove("unlocked");
    }
    if (storageAchievement.unlockedAt === null && this._isSecret === true) {
      this._infoIconElement.classList.add("secret");
      this._infoIconElement.src = "./svg/lock.svg";
      this._infoNameElement.innerText = "Secret Achievement";
      this._infoDescriptionElement.innerText =
        "Unlock this achievement to see its details.";
    } else {
      this._infoIconElement.classList.remove("secret");
      this._infoIconElement.src = `./images/${this._imagePath}.png`;
      this._infoNameElement.innerText = this._name;
      this._infoDescriptionElement.innerText = this._description;
    }
  }

  private getStorageAchievement(): StorageAchievement {
    const storageAchievements: StorageAchievement[] =
      (getStorageItem("achievements") as StorageAchievement[] | null) ?? [];
    const matchedStorageAchievement: StorageAchievement | null =
      storageAchievements.find(
        (storageAchievement: StorageAchievement): boolean =>
          storageAchievement.id === this._id,
      ) ?? null;
    if (matchedStorageAchievement === null) {
      throw new Error(
        `An attempt was made to get Achievement "${this._id}" StorageAchievement with the achievement missing from storage.`,
      );
    }
    return matchedStorageAchievement;
  }
}
export const createAchievement = (options: CreateAchievementOptions): string =>
  new Achievement(options).id;
export const unlockAchievement = (achievementID: string): void => {
  getDefinable<Achievement>(Achievement, achievementID).unlock();
};
