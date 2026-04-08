const injectDependencies = async () => {
  const util = await import("./util/index.js");
  const element_script = document.createElement("script");
  const dependencies_map = await util.dependency.dependencies_map;

  element_script.type = "importmap";
  element_script.innerText = JSON.stringify(dependencies_map);

  document.head.appendChild(element_script);
};

const pageGateway = async () => {
  const element_html = document.querySelector("html");
  const gateway_name = element_html.dataset.gateway;

  const { start } = await import(`./io/gateway/page/${gateway_name}.js`);
  return start;
};

const adapters = () => {
  const database_worker = new Worker("./io/adapter/database/database-worker.js", { type: "module" });

  return { database_worker };
};

injectDependencies().then(async () => {
  const { database_worker } = adapters();

  const start = await pageGateway();
  start({ database_worker });
});
