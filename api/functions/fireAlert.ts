import Swal, { SweetAlertResult } from "sweetalert2";

interface FireAlertOptions {
  readonly allowOutsideClick?: boolean;
  readonly bodyElement: HTMLElement;
  readonly onConfirm?: (confirmed: boolean) => void;
  readonly title: string;
  readonly showConfirmButton?: boolean;
  readonly showCancelButton?: boolean;
}

export const fireAlert = async (options: FireAlertOptions): Promise<void> => {
  const html: HTMLDivElement = document.createElement("div");
  const titleElement: HTMLHeadingElement = document.createElement("h2");
  titleElement.innerText = options.title;
  html.appendChild(titleElement);
  html.appendChild(options.bodyElement);
  const res: SweetAlertResult = await Swal.fire({
    allowEscapeKey: false,
    allowOutsideClick: options.allowOutsideClick ?? false,
    buttonsStyling: false,
    confirmButtonText: "Confirm",
    html,
    showCancelButton: options.showCancelButton ?? false,
    showConfirmButton: options.showConfirmButton ?? false,
  });
  if (typeof options.onConfirm !== "undefined" && res.isConfirmed) {
    options.onConfirm(res.isConfirmed);
  }
};
