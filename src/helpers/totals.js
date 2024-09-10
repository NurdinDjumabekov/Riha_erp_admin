export const totalSum = (list, count, keyPrice) => {
  return list?.reduce((total, item) => {
    return +total + +item?.[keyPrice] * +item?.[count];
  }, 0);
};

export const sumCountsFN = (list, keyCount) => {
  return list.reduce((prev, item) => +prev + +item?.[keyCount], 0);
};
