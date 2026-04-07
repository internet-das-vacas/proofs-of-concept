const worker_db = new Worker(new URL("../../adapter/database/database-worker.js", import.meta.url), { type: "module" });

worker_db.addEventListener("error", (error) => {
  console.error(error);
});

worker_db.addEventListener("message", ({ data }) => {
  if (data.type === "error") return console.error(...data.payload.args);
  return console.log(...data.payload.args);
});
