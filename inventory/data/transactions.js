let data = {};

const getSingleTransactionByID = (transaction_id) => data[transaction_id] || {};

const getLatest = (transaction) => {
  const versions = Object.keys(transaction) || [0];
  const latest = versions.at(-1) || 0;

  return latest;
};

export const state = {
  // General Gets
  get content() {
    return data;
  },

  // Specialized Gets with parameters
  byID(transaction_id) {
    const transaction = getSingleTransactionByID(transaction_id);
    const latest = getLatest(transaction);

    return transaction[latest];
  },

  // General Set
  set append(value) {
    const transaction_id = Object.keys(value)[0];
    const transaction = getSingleTransactionByID(transaction_id);
    const latest = getLatest(transaction);

    data = { ...data, ...{ [transaction_id]: { [latest + 1]: value[transaction_id] } } };
  },
};
