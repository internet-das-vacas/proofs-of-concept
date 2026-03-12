import * as models from "../models/index.js";

const accountIdFromName = (account_name) => models.accounts.model?.[account_name].id;

export const transaction = (
  transaction_date,
  goodThrough,
  good_through_date,
  tag,
  account_destination,
  amount_precise,
) => ({
  general: {
    date: transaction_date,
    type: "buy",
    description: { tags: [tag] },
  },
  finance: {
    accounts: {
      source_id: models.accounts.defaults.source,
      destination_id: accountIdFromName(account_destination),
    },
    amount: {
      currency: "BRL",
      precise: amount_precise,
    },
  },
  inventory: {
    lifecycle: { good_through_date, in_months: goodThrough },
  },
});

const entry = (transaction_id, date, amount, installment, type, account_name) => ({
  id: crypto.randomUUID(),
  date,
  amount: { currency: "BRL", precise: amount },
  type,
  account_id: accountIdFromName(account_name),
  installment,
  transaction_id,
});

export const entries = (
  goodThrough,
  transaction_date,
  transaction_month,
  entry_amount,
  transaction_id,
  account_destination,
) =>
  Array.from({ length: goodThrough }).map((_, index) => {
    const installment = index + 1;
    const entry_date = new Date(transaction_date);
    entry_date.setMonth(transaction_month + index);

    const default_params = [transaction_id, entry_date, entry_amount, installment];

    return [
      entry(...default_params, "inflow", account_destination),
      entry(...default_params, "outflow", models.accounts.defaults.source),
    ];
  }).flat();
