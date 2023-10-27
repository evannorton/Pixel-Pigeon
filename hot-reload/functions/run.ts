import { socket } from "../socket";

export const run = (): void => {
  console.log("Running PP hot-reloading.");
  socket.on("run-id", (runID: string) => {
    if (document.body.dataset.runId !== runID) {
      location.reload();
    }
  });
}
