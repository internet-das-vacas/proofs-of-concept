const balanceSheet = {
  feed: { id: 1, description: "Alimentação", type: "balance-sheet" },
  medicine: { id: 2, description: "Medicamento", type: "balance-sheet" },
  labor: { id: 3, description: "Mão de obra", type: "balance-sheet" },
  utilities: { id: 4, description: "Serviços públicos", type: "balance-sheet" },
  mechanical: { id: 5, description: "Operação Mecânica", type: "balance-sheet" },
  finance: { id: 6, description: "Despesas Financeiras", type: "balance-sheet" },
  other: { id: 7, description: "Outros", type: "balance-sheet" },
};

const inventoryUsage = {
  inventory: { id: 8, description: "Estoque", type: "inventory-usage" },
};

const profitAndLosses = {
  purse: { id: 9, description: "Gasto", type: "profit-loss" },
};

export const model = {
  ...balanceSheet,
  ...inventoryUsage,
  ...profitAndLosses,
};

export const defaults = {
  source: "purse",
};
