const FILE_SYSTEM_NAME = "internet-das-vacas-fs";
const DB_NAME = "internet-das-vacas";

const injectDependencies = async () => {
  const util = await import("./util/index.js");
  const { dependencies_map } = util.dependency;

  const element_script = document.createElement("script");
  element_script.type = "importmap";
  element_script.innerText = JSON.stringify(dependencies_map);
  document.head.appendChild(element_script);
};

const adapters = () => {
  const database_worker = new Worker("./io/adapter/database/database-worker.js", { type: "module" });

  return { database_worker };
};

const pageGateway = async () => {
  const element_html = document.querySelector("html");
  const gateway_name = element_html.dataset.gateway;

  const { start } = await import(`./io/gateway/page/${gateway_name}.js`);
  return start;
};

injectDependencies().then(() => {
  const { database_worker } = adapters();

  database_worker.addEventListener("message", async (event) => {
    const { type, data } = event.data;

    const db_ready = type === "system" && data?.command === "ready" && data?.success === true;
    if (db_ready) {
      database_worker.postMessage({
        command: "initialize",
        data: { file_system_name: FILE_SYSTEM_NAME, database_name: DB_NAME },
      });
    }

    // const db_initialized = type === "system" && data?.command === "initialize" && data?.success === true;
    const db_initialized = false;
    if (db_initialized) {
      const loader_el = document.getElementById("loader");
      loader_el.remove();

      const start = await pageGateway();
      start({ database_worker });
    }
  });
});
