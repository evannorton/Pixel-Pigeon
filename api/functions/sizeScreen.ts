import config from "../config";

const sizeScreen = (): void => {
  const screen = document.getElementById("screen");
  if (screen) {
    const aspectRatio: number = config.width / config.height;
    const screenAspectRatio: number = window.innerWidth / window.innerHeight;
    const stretchedScale: number =
      aspectRatio >= screenAspectRatio
        ? window.innerWidth / config.width
        : window.innerHeight / config.height;
    screen.style.width = `${config.width * stretchedScale}px`;
    screen.style.height = `${config.height * stretchedScale}px`;
  }
};

export default sizeScreen;
