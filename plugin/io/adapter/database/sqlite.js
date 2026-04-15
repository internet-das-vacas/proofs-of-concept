export const start = (file_system_name, database_name, callback_function) => {
  const database_worker = new Worker("./io/adapter/database/worker-sqlite.js", { type: "module" });

  database_worker.addEventListener("message", (event) => {
    const { type, data } = event.data;

    const db_ready = type === "system" && data?.command === "ready" && data?.success === true;
    if (db_ready) {
      database_worker.postMessage({
        command: "initialize",
        data: { file_system_name, database_name },
      });
    }

    const db_initialized = type === "system" && data?.command === "initialize" && data?.success === true;
    if (db_initialized) callback_function();
  });

  return database_worker;
};
