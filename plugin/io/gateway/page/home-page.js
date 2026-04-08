export const start = ({ database_worker }) => {
  database_worker.postMessage({ command: "query", data: { query: `SELECT 'Hello, world from the DB!'` } });

  database_worker.addEventListener("message", (event) => {
    const { type, data } = event.data;

    if (type === "response") {
      document.body.innerText = data[0].columns;
    }
  });
};
