import { fireAlert } from "./fireAlert";
import { getDefaultedError } from "./getDefaultedError";
import { state } from "../state";
import { toast } from "../constants/toasts";

export const handleUncaughtError = (error: unknown): void => {
  if (state.values.hasErrored === false) {
    state.setValues({ hasErrored: true });
    if (state.values.type === "zip") {
      const bodyElement: HTMLElement = document.createElement("div");
      const messageElement: HTMLParagraphElement = document.createElement("p");
      const defaultedError: Error = getDefaultedError(error);
      messageElement.innerText = defaultedError.message;
      bodyElement.appendChild(messageElement);
      const stack: string | undefined = defaultedError.stack;
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
        copyButtonElement.id = "copy-error-button";
        copyButtonElement.style.backgroundColor = "#151515";
        copyButtonElement.style.display = "block";
        copyButtonElement.style.position = "absolute";
        copyButtonElement.style.padding = "0";
        copyButtonElement.style.right = "0";
        copyButtonElement.style.top = "0";
        copyButtonElement.style.margin = "1em";
        copyButtonElement.style.borderRadius = "1em";
        copyButtonElement.style.width = "3em";
        copyButtonElement.style.height = "3em";
        copyButtonElement.style.display = "flex";
        copyButtonElement.style.justifyContent = "center";
        copyButtonElement.style.alignItems = "center";
        copyButtonElement.title = "Copy the Stack Trace";
        copyButtonElement.onclick = (): void => {
          navigator.clipboard
            .writeText(stack)
            .then((): void => {
              toast.success("Error copied to clipboard");
            })
            .catch((clipboardError: unknown): void => {
              toast.error("Failed to copy error to clipboard");
              console.error(
                "Failed to copy error to clipboard",
                clipboardError,
              );
            });
        };
        copyButtonIconElement.src = "./svg/copy.svg";
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
  }
};
