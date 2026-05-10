import { create } from "nipplejs";
import { getStretchedWidth } from "./getStretchedWidth";
import { state } from "../state";

export const cycleJoystick = (): void => {
  if (state.values.config === null) {
    throw new Error(
      "An attempt was made to cycle joystick before config was loaded.",
    );
  }
  if (typeof state.values.config.joystick !== "undefined") {
    const joystickElement: HTMLElement | null =
      document.getElementById("joystick");
    if (joystickElement === null) {
      throw new Error("Joystick element not found.");
    }
    if (state.values.joystick !== null) {
      state.values.joystick.destroy();
    }
    const ratio: number = getStretchedWidth() / state.values.config.width;
    const size: number = state.values.config.joystick.size * ratio;
    const x: number = state.values.config.joystick.x * ratio;
    const y: number = state.values.config.joystick.y * ratio;
    const joystick: ReturnType<typeof create> = create({
      color: {
        back: "rgba(255, 255, 255, 0.5)",
        front: "white",
      },
      mode: "static",
      position: {
        left: "50%",
        top: "50%",
      },
      size,
      zone: joystickElement,
    });
    joystickElement.style.width = `${size}px`;
    joystickElement.style.height = `${size}px`;
    joystickElement.style.left = `${x}px`;
    joystickElement.style.top = `${y}px`;
    // nipplejs does not export the event type
    // eslint-disable-next-line @typescript-eslint/typedef
    joystick.on("move", (e): void => {
      console.log("move", e);
    });
    state.setValues({ joystick });
  }
};
