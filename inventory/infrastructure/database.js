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
        const date_formatted = entry.date.toLocaleDateString("pt-BR");
        const entries = acc?.[date_formatted]
          ? [...acc?.[date_formatted], entry]
          : [entry];

        return { ...acc, [date_formatted]: entries };
      }, {});
  },
  set content(value) {
    this._data.push(...value);
  },
};
