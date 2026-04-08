export const start = ({ database_worker, element_root }) => {
  database_worker.postMessage({ command: "query", data: { query: `SELECT 'Hello, world from the DB!'` } });

  database_worker.addEventListener("message", (event) => {
    const { type, data } = event.data;

    if (type === "response") {
      element_root.innerText = data[0].columns;
    }
  });
};
