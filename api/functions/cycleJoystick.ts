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
      maxNumberOfJoysticks: 1,
      mode: "static",
      position: {
        left: "50%",
        top: "50%",
      },
      size,
      threshold: 0.5,
      zone: joystickElement,
    });
    joystickElement.style.width = `${size}px`;
    joystickElement.style.height = `${size}px`;
    joystickElement.style.left = `${x}px`;
    joystickElement.style.top = `${y}px`;
    // eslint-disable-next-line @typescript-eslint/typedef
    joystick.on("dir", (e): void => {
      if (typeof e.data.direction === "undefined") {
        return;
      }
      if (typeof e.data.direction.angle === "undefined") {
        return;
      }
      if (state.values.heldJoystickDirection !== null) {
        state.setValues({
          releasedJoystickDirections: [
            ...state.values.releasedJoystickDirections,
            state.values.heldJoystickDirection,
          ],
        });
      }
      state.setValues({
        heldJoystickDirection: e.data.direction.angle,
      });
      state.setValues({
        pressedJoystickDirections: [
          ...state.values.pressedJoystickDirections,
          e.data.direction.angle,
        ],
      });
    });
    joystick.on("end", (): void => {
      if (state.values.heldJoystickDirection !== null) {
        state.setValues({
          releasedJoystickDirections: [
            ...state.values.releasedJoystickDirections,
            state.values.heldJoystickDirection,
          ],
        });
      }
      state.setValues({
        heldJoystickDirection: null,
      });
    });
    // eslint-disable-next-line @typescript-eslint/typedef
    joystick.on("move", (e): void => {
      if (
        typeof e.data.direction === "undefined" ||
        typeof e.data.direction.angle === "undefined"
      ) {
        if (state.values.heldJoystickDirection !== null) {
          state.setValues({
            releasedJoystickDirections: [
              ...state.values.releasedJoystickDirections,
              state.values.heldJoystickDirection,
            ],
          });
        }
        state.setValues({
          heldJoystickDirection: null,
        });
      }
    });
    state.setValues({ joystick });
  }
};
