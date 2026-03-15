import * as models from "../models/index.js";

const data = [];

export const state = {
  // General Gets
  get content() {
    return data;
  },
  get assetsPerDate() {
    return data
      .filter((entry) => entry.account_id !== models.accounts.accountIDFromName(models.accounts.defaults.source))
      .reduce((acc, entry) => {
        const existing_entries_for_date = acc?.[entry.date];

        if (!existing_entries_for_date) return { ...acc, [entry.date]: [entry] };

        const negating_entry_index = existing_entries_for_date.findIndex((existing_entry) =>
          existing_entry.transaction_id === entry.transaction_id &&
          existing_entry.amount.precise === entry.amount.precise &&
          existing_entry.type !== entry.type
        );
        const no_negating_entry = negating_entry_index === -1;
        if (no_negating_entry) return { ...acc, [entry.date]: [...existing_entries_for_date, entry] };

        const entries_for_date = existing_entries_for_date.toSpliced(negating_entry_index, 1);
        if (entries_for_date.length) return { ...acc, [entry.date]: entries_for_date };

        delete acc[entry.date];
        return acc;
      }, {});
  },

  // Specialized Gets with parameters
  byTransactionID(transaction_id) {
    return data.filter((entry) => entry.transaction_id === transaction_id);
  },

  // General Set
  set append(value) {
    data.push(...value);
  },
};
