import socket from "../socket";

const run = (): void => {
  console.log("Running PMGL hot-reloading.");
  socket.on("run-id", (runID: string) => {
    if (document.body.dataset.runId !== runID) {
      location.reload();
    }
  });
}

export default run;