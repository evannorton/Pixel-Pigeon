export const goToPauseMenuSection = (section: string): void => {
  const pauseMenuElement: HTMLElement | null =
    document.getElementById("pause-menu");
  if (pauseMenuElement === null) {
    throw new Error(
      `An attempt was made to go to pause menu section "${section}" with no pause menu element in the DOM.`,
    );
  }
  pauseMenuElement.classList.remove("main");
  pauseMenuElement.classList.remove("achievements");
  pauseMenuElement.classList.remove("controls");
  pauseMenuElement.classList.add(section);
};
