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

const stopLoading = () => {
  const loader_el = document.getElementById("loader");
  loader_el.remove();
};

const adapters = async () => {
  const io = await import("./io/index.js");

  const { promise: is_ready, resolve: resolveReady } = Promise.withResolvers();

  const setRediness = () => {
    stopLoading();
    resolveReady(true);
  };

  const database_worker = io.adapter.database.start(FILE_SYSTEM_NAME, DB_NAME, setRediness);
  const plugin_worker = io.adapter.plugin.start();

  return { database_worker, plugin_worker, is_ready };
};

const pageGateway = async () => {
  const element_html = document.querySelector("html");
  const gateway_name = element_html.dataset.gateway;

  const { start } = await import(`./io/gateway/page/${gateway_name}.js`);
  return start;
};

injectDependencies().then(async () => {
  const container = document.getElementById("container");
  const { database_worker, plugin_worker, is_ready } = await adapters();

  if (await is_ready) {
    const start = await pageGateway();
    start({ database_worker, plugin_worker, element_root: container });
  }
});
