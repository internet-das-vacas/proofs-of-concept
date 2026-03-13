let data = {};

const getSingleTransaction = (transaction_id) => data[transaction_id] || {};

const getLatest = (transaction) => {
  const versions = Object.keys(transaction) || [0];
  const latest = versions.at(-1) || 0;

  return latest;
};

export const state = {
  get content() {
    return data;
  },
  byID(transaction_id) {
    const transaction = getSingleTransaction(transaction_id);
    const latest = getLatest(transaction);

    return transaction[latest];
  },
  set content(value) {
    const transaction_id = Object.keys(value)[0];
    const transaction = getSingleTransaction(transaction_id);
    const latest = getLatest(transaction);

    data = { ...data, ...{ [transaction_id]: { [latest + 1]: value[transaction_id] } } };
  },
};
