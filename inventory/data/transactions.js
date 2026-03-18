import * as models from "../models/index.js";

/**
 * @type {{[transaction_id: string]: {[version: number]: models.transaction.transaction_model}}}
 */
let data = {};

/**
 * @returns {number}
 */
const getLatestTransaction = (transaction) => {
  const versions = Object.keys(transaction) || [0];
  const latest = versions.at(-1) || 0;

  return latest;
};

/**
 * @returns {{[version: number]: models.transaction.transaction_model}}
 */
const getSingleTransactionByID = (transaction_id) => data[transaction_id] || {};

/**
 * @returns {models.transaction.transaction_model}
 */
const getTransactionByID = (transaction_id) => {
  const transaction = getSingleTransactionByID(transaction_id);
  const latest = getLatestTransaction(transaction);

  return transaction[latest];
};

const append = (transactionObjectWithIDKey) => {
  const transaction_id = Object.keys(transactionObjectWithIDKey)[0];
  const transaction_history = getSingleTransactionByID(transaction_id);
  const latest = getLatestTransaction(transaction_history);

  data = {
    ...data,
    ...{ [transaction_id]: { ...transaction_history, [latest + 1]: transactionObjectWithIDKey[transaction_id] } },
  };
};

export const state = {
  // General Gets
  get content() {
    return data;
  },

  // Specialized Gets with parameters
  byID(transaction_id) {
    return getTransactionByID(transaction_id);
  },

  // General Set
  set append(value) {
    append(value);
  },
};
