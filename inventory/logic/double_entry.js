import * as models from "../models/index.js";

// -----------
// Transaction
// -----------

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
      destination_id: models.accounts.accountIDFromName(account_destination),
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

export const is_same_transaction = (transaction, date, amount, goodThrough) => {
  const same_lifecycle = goodThrough === transaction.inventory.lifecycle.in_months;
  if (!same_lifecycle) return false;

  const same_amount = amount * 100 === transaction.finance.amount.precise;
  if (!same_amount) return false;

  const same_date = new Date(date) === new Date(transaction.general.date);
  if (!same_date) return false;

  return true;
};

// -----
// Entry
// -----

const entry = (transaction_id, date, amount, installment, flow, account_name) => ({
  id: crypto.randomUUID(),
  date,
  amount: { currency: "BRL", precise: amount },
  type: flow,
  account_id: models.accounts.accountIDFromName(account_name),
  installment,
  transaction_id,
});

const reverseFlow = (flow) => flow === "inflow" ? "outflow" : "inflow";

export const uniqueEntriesFromTransaction = (transaction_entries) => {
  const default_source_account_name = models.accounts.defaults.source;
  const default_source_account_id = models.accounts.accountIDFromName(default_source_account_name);

  const not_source_account = (entry) => entry.account_id !== default_source_account_id;
  const entries_not_source = transaction_entries.filter((entry) => not_source_account(entry));

  const unique_entries_by_date = entries_not_source.reduce((unique_dates_map, entry) => {
    const date_already_exists = !!unique_dates_map[entry.date];
    unique_dates_map[entry.date] = date_already_exists ? false : entry;

    return unique_dates_map;
  }, {});

  const unique_entries = Object.values(unique_entries_by_date).filter(Boolean);

  return unique_entries;
};

export const entrySourceAndDestination = (
  transaction_id,
  entry_date,
  entry_amount,
  installment,
  flow,
  account_destination,
) => {
  const default_params = [transaction_id, entry_date, entry_amount, installment];

  return [
    entry(...default_params, flow, account_destination),
    entry(...default_params, reverseFlow(flow), models.accounts.defaults.source),
  ];
};

export const entries = (
  goodThrough,
  transaction_date,
  transaction_month,
  entry_amount,
  transaction_id,
  account_destination,
  flow = "inflow",
) =>
  Array.from({ length: goodThrough }).map((_, index) => {
    const installment = index + 1;
    const entry_date = new Date(transaction_date);
    entry_date.setMonth(transaction_month + index);

    const default_params = [transaction_id, entry_date, entry_amount, installment];

    return entrySourceAndDestination(
      ...default_params,
      flow,
      account_destination,
    );
  }).flat();
