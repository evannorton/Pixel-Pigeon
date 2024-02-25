export const getGamepads = (): Gamepad[] => {
  const gamepads: Gamepad[] = [];
  if (typeof navigator.getGamepads === "function") {
    const navigatorGamepads: (Gamepad | null)[] = navigator.getGamepads();
    if (typeof navigatorGamepads.forEach === "function") {
      navigatorGamepads.forEach((gamepad: Gamepad | null): void => {
        if (gamepad) {
          gamepads.push(gamepad);
        }
      });
    }
  }
  return gamepads;
};
