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
    const stack: string | undefined = eventError.stack;
    if (typeof stack !== "undefined") {
      const errorMessageContainer: HTMLSpanElement =
        document.createElement("span");
      const stackElement: HTMLPreElement = document.createElement("pre");
      const copyButtonElement: HTMLButtonElement =
        document.createElement("button");
      const copyButtonIconElement: HTMLImageElement =
        document.createElement("img");
      errorMessageContainer.style.display = "block";
      errorMessageContainer.style.position = "relative";
      copyButtonElement.id = "copy-button";
      copyButtonElement.style.backgroundColor = "#343434";
      copyButtonElement.style.display = "block";
      copyButtonElement.style.position = "absolute";
      copyButtonElement.style.right = "0";
      copyButtonElement.style.top = "0";
      copyButtonElement.style.margin = "1em";
      copyButtonElement.style.borderRadius = "1em";
      copyButtonElement.title = "Copy the Stack Trace";
      copyButtonElement.onclick = (): void => {
        navigator.clipboard
          .writeText(stack)
          .then((): void => {
            console.log("Text copied successfully!");
          })
          .catch((err: unknown): void => {
            // Renamed 'error' to 'err' and added a type annotation
            console.error("Failed to copy text: ", err);
          });
      };
      copyButtonIconElement.src = "../../svg/copy.svg";
      copyButtonIconElement.style.width = "2em";
      stackElement.style.backgroundColor = "#343434";
      stackElement.style.border = "1px solid white";
      stackElement.style.overflowX = "auto";
      stackElement.style.padding = "0.5em";
      stackElement.style.textAlign = "left";
      stackElement.innerText = stack;
      errorMessageContainer.appendChild(stackElement);
      copyButtonElement.appendChild(copyButtonIconElement);
      errorMessageContainer.appendChild(copyButtonElement);
      bodyElement.appendChild(errorMessageContainer);
    }
    fireAlert({
      bodyElement,
      title: "Error",
    });
  }
};
