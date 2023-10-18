import { Definable } from "./Definable";
import { getAchievementUnlockRenderStartTime } from "../functions/getAchievementUnlockRenderStartTime";
import { getDefinable } from "../functions/getDefinable";
import { getToken } from "../functions/getToken";
import { state } from "../state";

export interface CreateAchievementOptions {
  description: string;
  imagePath: string;
  name: string;
}
export interface UnlockAchievementOptions {
  id: string;
}
export class Achievement extends Definable {
  private readonly _options: CreateAchievementOptions;
  public constructor(options: CreateAchievementOptions) {
    super(getToken());
    this._options = options;
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
}
export const createAchievement = (options: CreateAchievementOptions): string =>
  new Achievement(options).id;
export const unlockAchievement = (achievmentID: string): void => {
  getDefinable<Achievement>(Achievement, achievmentID).unlock();
};
