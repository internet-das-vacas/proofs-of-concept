export const preciseToCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value / 100);

export const stringToDate = (dateValue) => new Date(dateValue).toLocaleDateString("pt-BR", { timeZone: "UTC" });
