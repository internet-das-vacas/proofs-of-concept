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

const actionHandler = (worker) => {
  return (_event, target, plugin_id) =>
    worker.postMessage({ command: "execute", data: { initiator: target, plugin_id } });
};

const appendView = ({ target, item_id, item_name, plugin_id }, plugin_elements, clickActionHandler) => {
  const parent = [...plugin_elements].find((el) => el.dataset.context === target);
  const item = view.dom({ tag: "li", children: item_name, attributes: { id: item_id } });
  item.addEventListener("click", (event) => clickActionHandler(event, target, plugin_id));
  parent.append(item);
};

const detachView = ({ target, item_id }, plugin_elements, clickActionHandler) => {
  const parent = [...plugin_elements].find((el) => el.dataset.context === target);
  const target_el = parent.querySelector(`#${item_id}`);
  target_el.removeEventListener("click", (event) => clickActionHandler(event, target, plugin_id));
  target_el.remove();
};

const queueNotification = ({ message }) => {
  alert(message);
};

export const start = (plugin_registry, plugin_elements) => {
  const plugin_worker = new Worker("./io/adapter/plugin/worker-plugin.js", { type: "module" });
  const clickHandler = actionHandler(plugin_worker);

  plugin_worker.postMessage({ command: "initialize" });
  plugin_worker.addEventListener("message", (event) => {
    const { type, data } = event.data;

    const is_view_append = type === "view" && data.command === "append";
    if (is_view_append) appendView(data, plugin_elements, clickHandler);

    const is_view_detach = type === "view" && data.command === "detach";
    if (is_view_detach) detachView(data, plugin_elements, clickHandler);

    const is_notification = type === "notification";
    if (is_notification) queueNotification(data);
  });

  const marketplace_element = [...plugin_elements].find((el) => el.dataset.type === "marketplace");
  const plugin_render_marketplace = () => renderMarketplace(plugin_registry, marketplace_element, plugin_worker);

  return { plugin_worker, plugin_render_marketplace };
};
