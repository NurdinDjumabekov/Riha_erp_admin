export const validNums = (text) => {
  const isValid = /^[0-9.]*$/.test(text);
  return !isValid;
};

export const chechEmptyCount = (list) => {
  // Проверка, является ли count пустым или равным нулю
  return list?.some((item) => item?.count == "" || item?.count == 0) || false;
};
