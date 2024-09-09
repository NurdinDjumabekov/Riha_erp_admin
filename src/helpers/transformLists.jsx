export const transformLists = (list, key1, key2) => {
  const newList = list?.map((i) => ({
    ...i,
    value: i?.[key1],
    label: i?.[key2],
  }));

  return newList;
};

export const transformListsProds = (list) => {
  ///// убираю лишние ключи
  const newList = list?.map(({ product_guid, count, workshop_price }) => {
    return { product_guid, count, workshop_price };
  });

  return newList;
};
