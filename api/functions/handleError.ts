import { state } from "../state";
import fireAlert from "./fireAlert";

export const handleError = (errorEvent: ErrorEvent): void => {
  if (state.values.hasErrored === false) {
    state.setValues({ hasErrored: true });
    const bodyElement: HTMLElement = document.createElement("div");
    const messageElement: HTMLParagraphElement = document.createElement("p");
    const eventError: Error =
      errorEvent.error instanceof Error
        ? errorEvent.error
        : new Error("An unknown error occurred.");
    messageElement.innerText = eventError.message;
    bodyElement.appendChild(messageElement);
    if (typeof eventError.stack !== "undefined") {
      const stackElement: HTMLPreElement = document.createElement("pre");
      stackElement.style.textAlign = "left";
      stackElement.innerText = eventError.stack;
      bodyElement.appendChild(stackElement);
    }
    fireAlert({
      bodyElement,
      title: "Error",
    }).catch((error: unknown): void => {
      throw error;
    });
  }
};
