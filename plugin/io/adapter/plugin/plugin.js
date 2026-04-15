export const start = async () => {
  const plugin_worker = new Worker("./io/adapter/plugin/worker-plugin.js", { type: "module" });

  plugin_worker.postMessage({ command: "initialize" });

  return plugin_worker;
};
