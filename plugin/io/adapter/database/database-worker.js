import * as util from "../../../util/index.js";
const { imports } = util.dependency.dependencies_map;

const { default: ModuleFactory } = await import(imports["database/module"]);
const { OPFSCoopSyncVFS: VirtualFileSystem } = await import(imports["database/virtual-file-system/opfs"]);
const SQLite = await import(imports["database"]);

let sqlite3;
let db;

const initialize = async (file_system_name, database_name) => {
  // Initialize SQLite.
  const module = await ModuleFactory();
  sqlite3 = SQLite.Factory(module);

  // Register a custom file system.
  const vfs = await VirtualFileSystem.create(file_system_name, module);
  sqlite3.vfs_register(vfs, true);

  db = await sqlite3.open_v2(database_name);
};

self.addEventListener("message", async (event) => {
  const { command, data } = event.data;

  if (command === "initialize") {
    const { file_system_name, database_name } = data;
    await initialize(file_system_name, database_name);
    self.postMessage({ type: "system", data: { command: "initialize", success: true } });
  }

  if (command === "query") {
    const { query } = data;

    const results = [];
    for await (const stmt of sqlite3.statements(db, query)) {
      const rows = [];
      while (await sqlite3.step(stmt) === SQLite.SQLITE_ROW) {
        const row = sqlite3.row(stmt);
        rows.push(row);
      }

      const columns = sqlite3.column_names(stmt);
      if (columns.length) {
        results.push({ columns, rows });
      }
    }

    self.postMessage({ type: "response", data: results });
  }
});

self.postMessage({ type: "system", data: { command: "ready", success: true } });
