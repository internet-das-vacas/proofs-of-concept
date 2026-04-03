export const { default: dependencies_map } = await import("../import-map.json", { with: { type: "json" } });

export const importer = async (module) => {
  const dependency = dependencies_map.imports[module];
  await import(dependency);
};
