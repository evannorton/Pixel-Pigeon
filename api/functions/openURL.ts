export const openURL = (url: string): void => {
  window.open(url, "_blank")?.focus();
};
