export const transformLists = (list, key1, key2) => {
  const newList = list?.map((i) => ({
    ...i,
    value: i?.[key1],
    label: i?.[key2],
  }));

  return newList;
};
