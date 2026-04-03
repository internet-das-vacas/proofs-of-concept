const importDependencies = async () => {
  const util = await import("./util/index.js");
  const element_script = document.createElement("script");
  const dependencies_map = await util.dependency.dependencies_map;

  element_script.type = "importmap";
  element_script.innerText = JSON.stringify(dependencies_map);

  document.head.appendChild(element_script);
};

const launchPage = () => {
  const element_html = document.querySelector("html");
  const gateway_name = element_html.dataset.gateway;

  return import(`./io/gateway/page/${gateway_name}.js`);
};

importDependencies().then(launchPage);
