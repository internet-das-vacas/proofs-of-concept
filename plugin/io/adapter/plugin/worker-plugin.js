const plugins = {};

const views = {
  menu: {
    append: function ({ id, name, action }) {
      const { callerID } = Object.getPrototypeOf(this);
      const item_id = id.description.replaceAll(" ", "_");
      const target = "menu";

      self.postMessage({
        type: "view",
        data: { command: "append", target, item_id, item_name: name, plugin_id: callerID },
      });

      plugins[callerID].actions = { [target]: action };
    },
    detach: (id) => {
      const item_id = id.description.replaceAll(" ", "_");

      self.postMessage({
        type: "view",
        data: { command: "detach", target: "menu", item_id },
      });
    },
  },
};

const notification = {
  publish: ({ message }) => {
    self.postMessage({ type: "notification", data: { message } });
  },
};

const start = async (url) => {
  const { activate, deactivate } = await import(url);
  return { activate, deactivate };
};

const run = async (id, pluginCallback, views_allowed_names) => {
  const metadata = { callerID: id };

  const views_allowed = views_allowed_names.reduce(
    (views_obj, name) => {
      views_obj[name] = Object.create(metadata);
      Object.assign(views_obj[name], views[name]);
      return views_obj;
    },
    {},
  );

  return await pluginCallback({ views: views_allowed, notification });
};

const execute = (initiator, plugin_id) => {
  plugins[plugin_id].actions[initiator]();
};

self.addEventListener("message", async (event) => {
  const { command, data } = event.data;

  if (command === "initialize") {
    // TBD
  }

  if (command === "register") {
    const { id, url, views } = data;
    const { activate, deactivate } = await start(url);
    plugins[id] = { activate, deactivate, metadata: data };

    await run(id, activate, views);
  }

  if (command === "unregister") {
    const { id, views } = data;
    await run(id, plugins[id].deactivate, views);

    delete plugins[id];
  }

  if (command === "execute") {
    const { initiator, plugin_id } = data;
    execute(initiator, plugin_id);
  }
});
