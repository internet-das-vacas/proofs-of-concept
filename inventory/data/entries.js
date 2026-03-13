const data = [];

export const state = {
  get content() {
    return data;
  },
  get assetsPerDate() {
    return data
      .filter((entry) => entry.type === "inflow")
      .reduce((acc, entry) => {
        const entries = acc?.[entry.date] ? [...acc?.[entry.date], entry] : [entry];

        return { ...acc, [entry.date]: entries };
      }, {});
  },
  set content(value) {
    data.push(...value);
  },
};
