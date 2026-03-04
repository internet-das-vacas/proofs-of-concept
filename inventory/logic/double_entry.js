import * as models_accounts from "../models/accounts.js";

export const transactionObject = (
  transaction_date,
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
      source_id: models_accounts.defaults.source,
      destination_id: models_accounts.model?.[account_destination].id,
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

export const entriesList = (
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

    const entry = {
      id: crypto.randomUUID(),
      date: entry_date,
      amount: { currency: "BRL", precise: entry_amount },
      type: "asset",
      account_id: models_accounts.model?.[account_destination].id,
      transaction: transaction_id,
    };

    return [{ ...entry }, {
      ...entry,
      id: crypto.randomUUID(),
      type: "liability",
      account_id: models_accounts.defaults.source,
    }];
  }).flat();
