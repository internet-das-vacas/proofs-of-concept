import * as util from "../../../util/index.js";
const { imports } = util.dependency.dependencies_map;

const { default: moduleFactory } = await import(imports["database/module"]);
const { OPFSCoopSyncVFS: VirtualFileSystem } = await import(imports["database/virtual-file-system/opfs"]);
const SQLite = await import(imports["database"]);

// Initialize SQLite.
const module = await moduleFactory();
const sqlite3 = SQLite.Factory(module);

// Register a custom file system.
const vfs = await VirtualFileSystem.create("internet-das-vacas-fs", module);
sqlite3.vfs_register(vfs, true);

// Open the database.
const db = await sqlite3.open_v2("db_name");

const query = `SELECT 'Hello, world!'`;

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

console.log(results);
