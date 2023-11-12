import { fireAlert } from "./fireAlert";
import { state } from "../state";

export const handleUncaughtError = (error: unknown): void => {
  if (state.values.hasErrored === false) {
    state.setValues({ hasErrored: true });
    const bodyElement: HTMLElement = document.createElement("div");
    const messageElement: HTMLParagraphElement = document.createElement("p");
    const eventError: Error =
      error instanceof Error ? error : new Error("An unknown error occurred.");
    messageElement.innerText = eventError.message;
    bodyElement.appendChild(messageElement);
    if (typeof eventError.stack !== "undefined") {
      const stackElement: HTMLPreElement = document.createElement("pre");
      stackElement.style.overflowX = "auto";
      stackElement.style.marginBottom = "-0.5em";
      stackElement.style.paddingBottom = "0.5em";
      stackElement.style.textAlign = "left";
      stackElement.innerText = eventError.stack;
      bodyElement.appendChild(stackElement);
    }
    fireAlert({
      bodyElement,
      title: "Error",
    }).catch((caughtError: unknown): void => {
      throw caughtError;
    });
  }
};
