import * as view from "../view/html.js";

const renderMarketplace = (registry, marketplace_element, plugin_worker) => {
  const registry_ids = Object.keys(registry);

  const marketplace_items_elements = registry_ids.map((id) => {
    const { name } = registry[id];
    const input = view.dom({ tag: "input", attributes: { type: "checkbox", name: id, id } });
    const label = view.dom({ tag: "label", children: name, attributes: { htmlFor: id } });

    input.addEventListener(
      "change",
      (event) => {
        const command = event.target.checked ? "register" : "unregister";
        plugin_worker.postMessage({ command, data: { id, ...registry[id] } });
      },
    );

    return [input, label];
  }).flat();

  marketplace_element.append(...marketplace_items_elements);
};

export const start = (plugin_registry, plugin_elements) => {
  const plugin_worker = new Worker("./io/adapter/plugin/worker-plugin.js", { type: "module" });
  plugin_worker.postMessage({ command: "initialize" });

  const marketplace_element = [...plugin_elements].find((el) => el.dataset.type === "marketplace");

  const plugin_render_marketplace = () => renderMarketplace(plugin_registry, marketplace_element, plugin_worker);

  return { plugin_worker, plugin_render_marketplace };
};
