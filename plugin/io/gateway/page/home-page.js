export const start = ({ database_worker, plugin_worker, element_root }) => {
  database_worker.postMessage({ command: "query", data: { query: `SELECT 'Olar mundo!'` } });

  database_worker.addEventListener("message", (event) => {
    const { type, data } = event.data;

    if (type === "response") {
      element_root.innerText = `Informação do DB: ${data[0].columns}`;
    }
  });
};
