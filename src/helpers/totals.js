export const totalSum = (list, count, keyPrice) => {
  return list?.reduce((total, item) => {
    return +total + +item?.[keyPrice] * +item?.[count];
  }, 0);
};

export const sumCountsFN = (list, keyCount) => {
  return list?.reduce((prev, item) => +prev + +item?.[keyCount], 0);
};

export const roundingNum = (count) => {
  ///// округления числа
  /// если больше 0, то округлять до 1го числа, а если его нет, то выводится просто целое число без 0
  return +count % 1 === 0 ? +count?.toFixed(0) : +count?.toFixed(1);
};
