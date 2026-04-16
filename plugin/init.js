const FILE_SYSTEM_NAME = "internet-das-vacas-fs";
const DB_NAME = "internet-das-vacas";

const dom_container = document.getElementById("container");
const dom_plugin_elements = document.querySelectorAll("slot");

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
  const { default: PLUGIN_REGISTRY } = await import("./.third-party/plugin-register.json", { with: { type: "json" } });
  const { promise: is_ready, resolve } = Promise.withResolvers();

  const setRediness = () => {
    stopLoading();
    resolve(true);
  };

  const { database_worker } = io.adapter.database.start(FILE_SYSTEM_NAME, DB_NAME, setRediness);
  const { _plugin_worker, plugin_render_marketplace } = io.adapter.plugin.start(PLUGIN_REGISTRY, dom_plugin_elements);

  return { is_ready, database_worker, plugin_render_marketplace };
};

const pageGateway = async () => {
  const element_html = document.querySelector("html");
  const gateway_name = element_html.dataset.gateway;

  const { start } = await import(`./io/gateway/page/${gateway_name}.js`);
  return start;
};

injectDependencies().then(async () => {
  const { database_worker, plugin_render_marketplace, is_ready } = await adapters();

  if (await is_ready) {
    plugin_render_marketplace();
    const start = await pageGateway();
    start({ database_worker, element_root: dom_container });
  }
});
