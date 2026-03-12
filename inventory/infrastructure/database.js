export const transactions_state = {
  _data: {},
  get content() {
    return this._data;
  },
  set content(value) {
    this._data = { ...this._data, ...value };
  },
};

export const entries_state = {
  _data: [],
  get content() {
    return this._data;
  },
  get assetsPerDate() {
    return this._data
      .filter((entry) => entry.type === "inflow")
      .reduce((acc, entry) => {
        const entries = acc?.[entry.date] ? [...acc?.[entry.date], entry] : [entry];

        return { ...acc, [entry.date]: entries };
      }, {});
  },
  set content(value) {
    this._data.push(...value);
  },
};
