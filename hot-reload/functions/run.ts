import { socket } from "pigeon-mode-game-framework/hot-reload/socket";

export const run = (): void => {
  console.log("Running PMGF hot-reloading.");
  socket.on("run-id", (runID: string) => {
    if (document.body.dataset.runId !== runID) {
      location.reload();
    }
  });
}
