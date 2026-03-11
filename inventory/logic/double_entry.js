import * as models from "../models/index.js";

const accountIdFromName = (account_name) => models.accounts.model?.[account_name].id;

export const transaction = (transaction_date, good_through_date, tag, account_destination, amount_precise) => ({
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
    lifecycle: { good_through_date },
  },
});

const entry = (transaction_id, date, amount, type, account_name) => ({
  id: crypto.randomUUID(),
  date,
  amount: { currency: "BRL", precise: amount },
  type,
  account_id: accountIdFromName(account_name),
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
    const entry_date = new Date(transaction_date);
    entry_date.setMonth(transaction_month + index);

    const default_params = [transaction_id, entry_date, entry_amount];

    return [
      entry(...default_params, "inflow", account_destination),
      entry(...default_params, "outflow", models.accounts.defaults.source),
    ];
  }).flat();
